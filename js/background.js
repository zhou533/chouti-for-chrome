$(function(){
	
	function checkUrl(tab) {
		var match, scheme, banned;
		if(tab.url){
			match = tab.url.match(/^(.*?):/);
			scheme = match[1].toLowerCase();
			if (scheme != "http" && scheme != "https") banned = true;
		}else{
			banned = true;
		}
		
		if(banned){
			//alert(tab.url);
			return null;
		}
		
		return tab.url;
	}
	//
	var getCurrentWindowCallback = 
	
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
		}else if(request.action == "show"){
			chrome.windows.getLastFocused(function(win){
				//alert(win.id);
				var getSelectedTabCallback = function(tab){
					//alert(tab.id);
					var url = checkUrl(tab);
					if(url){
						//alert(url);
						chouti.show(url, {
							success:function(link){
								if(link.id){
									//alert(link.id);
									sendResponse({});
								}else{
									//alert("empty");
									sendResponse({
										status:"empty",
										url:tab.url,
										title:tab.title
									});
								}
							},
							error:function(err){
								sendResponse({
									status:"error",
									error:err.error
								});
							}
						});
					}else{
						sendResponse({
							status:"error",
							error:"URL is illegal"
						});
					}
				}
				chrome.tabs.getSelected(win.id, getSelectedTabCallback);
			});
		}else if(request.action == "up"){
			chouti.up(request.linkId, {
				success:function(ups){
					sendResponse({
						status:"ups",
						ups:ups
					});
				},
				error:function(err){
				
				}
			});
		}
	});

});
