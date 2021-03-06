$(function(){
	var authentication = (function authentication(){
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
	}());
	
	addMessageListener(function(request, sender, sendResponse){
		if(request.action == "login"){
			//alert("login");
			chouti.login(request.username, request.password, {
				success:function(){
					
					if(request.tabId){
						chrome.tabs.update(request.tabId,{
							selected:true
						});
					}
					
					chrome.tabs.query({}, function(tabs){
						$.each(tabs, function(index, tab){
							chrome.browserAction.setPopup({
								tabId:tab.id,
								popup:""
							});
						});
					});
					
					chrome.extension.sendMessage({
						action: "updateOptions"
					});
					
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
			//alert("logout");
			//
			chrome.tabs.query({}, function(tabs){
				$.each(tabs, function(index, tab){
					chrome.browserAction.setPopup({
						tabId:tab.id,
						popup:"../html/login.html"
					});
				});
			});
			
			//
			sendResponse({});
		}else if (request.action == "showLoginWindow") {
			
			authentication.showLoginWindow();
			sendResponse({});
		}
	});
	
	function handleUpToChouTi(tab, inUrl){
		//alert("Up");
		if(!chouti.isAuthorized()){
			authentication.showLoginWindow(tab, function(){
				handleUpToChouTi(tab, inUrl);
			});
			return;
		}
	};
	
	chrome.browserAction.onClicked.addListener(handleUpToChouTi);
	chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
		//alert("tab " + tabId + " updated");
		if(!chouti.isAuthorized()){
			chrome.browserAction.setPopup({
				tabId:tabId,
				popup:"../html/login.html"
			});
		}
	});
	
	chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
		if(tab.active){
			chouti.show(tab.url, function(){
			
			});
		}
	});
});