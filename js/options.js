var init = function(){
	var usernameField = document.getElementById("username-field"); 

	var logoutLinkWrapper = document.getElementById("logout-link-wrapper");
	var loginLinkWrapper = document.getElementById("login-link-wrapper");
	var username = localStorage['username'];
	if(username){
		usernameField.innerHTML = username;
		logoutLinkWrapper.style.display = "inline";
		usernameField.style.display = "inline";
		loginLinkWrapper.style.display = "none";
	}else{
		usernameField.style.display = "none";
		logoutLinkWrapper.style.display = "none";
		loginLinkWrapper.style.display = "inline";
	}
	
	var logoutLink = document.getElementById("logout-link");
	logoutLink.onclick = function () {
		// Inform background.js to logout
		//alert("ll");
		chrome.extension.sendMessage({action:"logout"}, function() {
			init(); 
		});
	};
};

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.action == "updateOptions") {
		init();
	};
});

window.onload = init;
