$(function(){
	/*var authentication = (function authentication(){
		function showLoginWindow(targetTab, afterLogin){
			var width = 427, height = 384;
			chrome.windows.create({
				'url': '../html/login.html',
				'type': 'popup',
				'width': width,
				'height': height,
				'left': (screen.width / 2) - ((width + 1) / 2),
				'top': (screen.height / 2) - (height / 2)
			}, function(){});
		}
		
		return{
			showLoginWindow : showLoginWindow
		};
	}());*/
	
	chrome.extension.onMessage.addListener(function(request, sender, sendResponse){
		if(request.action == "login"){
			//alert("login");
			chouti.login(request.username, request.password, {
				success:function(){
					
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
		}else if (request.action == "showLoginWindow") {

		}
	});

});
