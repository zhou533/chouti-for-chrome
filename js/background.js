$(function(){
	chrome.extension.onRequest.addListener(function(request, sender, sendRequest){
		if(request.action == "login"){
			alert("login");
			chouti.login(request.username, request.password, null);
		}else if(request.action == "logout"){
		
		}
	});
});