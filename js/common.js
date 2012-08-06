function addMessageListener(handler){
	if(window.chrome.extension.onMessage){
		chrome.extension.onMessage.addListener(handler);
	}else{
		chrome.extension.onRequest.addListener(handler);
	}
}

function sendMessage(message, cb){
	if(window.chrome.extension.sendMessage){
		chrome.extension.sendMessage(message, cb);
	}else{
		chrome.extension.sendRequest(message, cb);
	}
}