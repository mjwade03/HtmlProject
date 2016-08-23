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
            var profileHTML = '<div class="profile"><div class="head">Welcome '+resp.name.givenName+'! <a href="javascript:void(0);" onclick="signOut();">Sign out</a></div>';
            //profileHTML += '<img src="'+resp.image.url+'"/><div class="proDetails"><p>'+resp.displayName+'</p><p>'+resp.emails[0].value+'</p><p>'+resp.gender+'</p><p>'+resp.id+'</p><p><a href="'+resp.url+'">View Google+ Profile</a></p></div></div>';
            profileHTML += '<img src="' + resp.image.url + '"/><div class="proDetails"><p>' + resp.displayName + '</p><p>' + resp.emails[0].value + '</p></div></div>';
            $('.userContent').html(profileHTML);
            $('#gSignIn').slideUp('slow');
            $('#facebookSignIn').slideUp('slow');
            var respjson = JSON.stringify(resp);
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
    alert(error);
}

function renderButton() {
    gapi.signin2.render('gSignIn', {
        'scope': 'profile email',
        'width': 240,
        'height': 50,
        'longtitle': true,
        'theme': 'dark',
        'onsuccess': onSuccess,
        'onfailure': onFailure
    });
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        $('.userContent').html('');
        $('#gSignIn').slideDown('slow');
        $('#facebookSignIn').slideDown('slow');
    });
}
