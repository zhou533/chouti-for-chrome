$(function(){
	
	chrome.extension.onMessage.addListener(function(request, sender, sendResponse){
		if(request.action == "login"){
			//alert("login");
			chouti.login(request.username, request.password, {
				success:function(){
				
					chrome.extension.sendMessage({action:"updateOptions"}, function() {});
					
					sendResponse({
						status:"success"
					});
					
				},
				error:function(err){
					sendResponse({
						status:"error",
						error:err.error
					});
				}
			});
			return true;
		}else if(request.action == "logout"){
			chouti.logout();
			//
			sendResponse({});
		}
	});

});
