var loginuserdata;

function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail());
    var profileHTML = '<div class="profile"><div class="head">Welcome '+profile.getName()+'! <a href="javascript:void(0);" onclick="signOut();">Sign out</a></div>';
    profileHTML += '<img src="'+profile.getImageUrl()+'"/><div class="proDetails"><p>'+profile.getName()+'</p><p>'+profile.getEmail()+'</p></div></div>';
    $('.userContent').html(profileHTML);
    $('#gSignIn').slideUp('slow');
    $('#facebookSignIn').slideUp('slow');
}

function onSuccess(googleUser) {
    var profile = googleUser.getBasicProfile();
    gapi.client.load('plus', 'v1', function () {
        var request = gapi.client.plus.people.get({
            userId: 'me'
        });
        //Display the user details
        request.execute(function (resp) {
            var profileHTML = '<div class="profile"><div class="head">Welcome '+resp.name.givenName+'! <img src="' + resp.image.url + '"/><a href="javascript:void(0);" onclick="signOut();">Sign out</a></div>';
            //profileHTML += '<img src="'+resp.image.url+'"/><div class="proDetails"><p>'+resp.displayName+'</p><p>'+resp.emails[0].value+'</p><p>'+resp.gender+'</p><p>'+resp.id+'</p><p><a href="'+resp.url+'">View Google+ Profile</a></p></div></div>';
            // profileHTML += '<img src="' + resp.image.url + '"/><div class="proDetails"><p>' + resp.displayName + '</p><p>' + resp.emails[0].value + '</p></div></div>';
            $('.userContent').html(profileHTML);
            $('#gSignIn').slideUp('slow');
            $('#facebookSignIn').slideUp('slow');
            // Build the post string from an object
            var post_data = {};
            post_data.id = resp.id;
            post_data.name = resp.name.givenName;
            post_data.email = resp.emails[0].value;
            post_data.islogin = 'Y';
            getDateTime(function (resp) {
                post_data.loginTime = resp;
            });
            //var respjson = JSON.stringify(resp);
            // And POST send the resp over to the server
            $.ajax({
                type: 'POST',
                url: node_jsServerUrl + "LoginData",
                data: JSON.stringify(post_data),
                dataType: 'text',
                success: function (data) {
                    setCookie("currentUser", post_data.id, 1);
                    generate('success', "Google+ 登入成功!!!");
                    console.log('success');
                    console.log(JSON.stringify(data));
                    loginuserdata = post_data;
                },
            });
        });
    });
}

/**
   * Handler for the signin callback triggered after the user selects an account.
   */
  function onSignInCallback(resp) {
    gapi.client.load('plus', 'v1', apiClientLoaded);
}

/**
   * Sets up an API call after the Google API client loads.
   */
  function apiClientLoaded() {
    gapi.client.plus.people.get({ userId: 'me' }).execute(handleEmailResponse);
}

/**
   * Response callback for when the API client receives a response.
   *
   * @param resp The API response object with the user email and profile information.
   */
  function handleEmailResponse(resp) {
    var primaryEmail;
    for (var i = 0; i < resp.emails.length; i++) {
        if (resp.emails[i].type === 'account') primaryEmail = resp.emails[i].value;
    }
    document.getElementById('responseContainer').value = 'Primary email: ' +
        primaryEmail + '\n\nFull Response:\n' + JSON.stringify(resp);
}

function onFailure(error) {
    generate('error', error);
}

function renderButton() {
    gapi.signin2.render('gSignIn', {
        'scope': 'profile email',
        'width': 180,
        'height': 40,
        'longtitle': true,
        'theme': 'dark',
        'onsuccess': onSuccess,
        'onfailure': onFailure
    });
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        loginuserdata.islogin = 'N';
        getDateTime(function (resp) { 
            loginuserdata.logoutTime = resp;
        });
        $.ajax({
            type: 'POST',
            url: node_jsServerUrl + "LoginData",
            data: JSON.stringify(loginuserdata),
            dataType: 'text',
            success: function (data) {
                delCookie("currentUser");
                generate('success', "Google+ 登出成功!!!");
                console.log('success');
            },
        });

        $('.userContent').html('');
        $('#gSignIn').slideDown('slow');
        $('#facebookSignIn').slideDown('slow');
    });
}

function getDateTime(callback) {
    var timeDate = new Date();
    var tMonth = (timeDate.getMonth() + 1) > 9 ? (timeDate.getMonth() + 1) : '0' + (timeDate.getMonth() + 1);
    var tDate = timeDate.getDate() > 9 ? timeDate.getDate() : '0' + timeDate.getDate();
    var tHours = timeDate.getHours() > 9 ? timeDate.getHours() : '0' + timeDate.getHours();
    var tMinutes = timeDate.getMinutes() > 9 ? timeDate.getMinutes() : '0' + timeDate.getMinutes();
    var tSeconds = timeDate.getSeconds() > 9 ? timeDate.getSeconds() : '0' + timeDate.getSeconds();
    var now = timeDate.getFullYear() + '-' + tMonth + '-' + tDate + ' ' + tHours + ':' + tMinutes + ':' + tSeconds;
    callback(now);
}
