function onLogin(response) {
  if (response.status == 'connected') {
    FB.api('/me?fields=id,name', function(data) {
      var welcomeBlock = document.getElementById('fb-welcome');
      welcomeBlock.innerHTML = 'Hello, ' + data.name + '!';
    });
  }
}

function login() {
  FB.getLoginStatus(function(response) {
    // Check login status on load, and if the user is
    // already logged in, go directly to the welcome message.
    if (response.status == 'connected') {
      onLogin(response);
    } else {
      // Otherwise, show Login dialog first.
      FB.login(function(response) {
        onLogin(response);
      }, {scope: 'user_friends, email'});
    }
  });
}

login();