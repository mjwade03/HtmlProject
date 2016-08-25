  function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
        SignInAPI();
        $('#gSignIn').slideUp('slow');
    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into this app.';
    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into Facebook.';
        $('#gSignIn').slideDown('slow');
    }
  }

  // This function is called when someone finishes with the Login
  // Button.  See the onlogin handler attached to it in the sample
  // code below.
  function checkLoginState() {
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  }

  window.fbAsyncInit = function() {
    FB.init({
      appId      : '1840608946167688',
      xfbml      : true,
      version    : 'v2.7'
    });

  // Now that we've initialized the JavaScript SDK, we call 
  // FB.getLoginStatus().  This function gets the state of the
  // person visiting this page and can return one of three states to
  // the callback you provide.  They can be:
  //
  // 1. Logged into your app ('connected')
  // 2. Logged into Facebook, but not your app ('not_authorized')
  // 3. Not logged into Facebook and can't tell if they are logged into
  //    your app or not.
  //
  // These three cases are handled in the callback function.

  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });

  };

  // Load the SDK asynchronously
  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/zh_TW/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));

    //(function(d, s, id) {
    //    var js, fjs = d.getElementsByTagName(s)[0];
    //    if (d.getElementById(id)) return;
    //    js = d.createElement(s); js.id = id;
    //    js.src = "//connect.facebook.net/zh_TW/sdk.js#xfbml=1&version=v2.7&appId=1840608946167688";
    //    fjs.parentNode.insertBefore(js, fjs);
    //} (document, 'script', 'facebook-jssdk'));

  // Here we run a very simple test of the Graph API after login is
  // successful.  See statusChangeCallback() for when this call is made.
function SignInAPI() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
        console.log('Successful login for: ' + response.name);
        document.getElementById('status').innerHTML =
            'Thanks for logging in, ' + response.name + '!';

        var post_data = {};
        post_data.id = response.id;
        post_data.name = response.name;
        post_data.email = response.email;
        // And POST send the resp over to the server
        $.ajax({
            type: 'POST',
            url: node_jsServerUrl + "LoginData",
            data: JSON.stringify(post_data),
            dataType: 'text',
            success: function (data) {
                console.log('success');
                console.log(JSON.stringify(data));
            },
        });

    });
}

function fbSignOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    FB.getLoginStatus(function (response) {
        if (response.statue == 'connected') {
            FB.logout();
            $('.userContent').html('');
        }
    });

    //auth2.signOut().then(function () {
    //    $('.userContent').html('');
    //    $('#gSignIn').slideDown('slow');
    //    $('#facebookSignIn').slideDown('slow');
    //});
}