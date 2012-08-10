var popup;

function popup(){

	document.querySelector("#loginControl").addEventListener("click", login);
	
	function showWaiting(message){
		if(message){
			document.querySelector("#waitingText").textContent = message;
		}else{
			document.querySelector("#waitingText").textContent = chrome.i18n.getMessage("popup_waiting");
		}
		document.querySelector("#waitingView").style.display = "";
	}
	
	function hideWaiting(){
		document.querySelector("#waitingView").style.display = "none";
	}
	
	function showLogin(){
		document.querySelector("#loginView").style.display = "";
	}
	
	function hideLogin() {
		document.querySelector("#loginView").style.display = "none";
	}
	
	function showCreate(){
		document.querySelector("#createView").style.display = "";
	}
	
	function hideCreate(){
		document.querySelector("#createView").style.display = "none";
	}
	
	function showResult(){
		document.querySelector("#resultView").style.display = "";
	}
	
	function hideResult(){
		document.querySelector("#resultView").style.display = "none";
	}
	
	//
	function LoginView(){
		hideWaiting();
		hideCreate();
		hideResult();
		showLogin();
	}
	
	function WaitingView(message){
		hideLogin();
		hideCreate();
		hideResult();
		showWaiting(message);
	}
	
		
	//
	function login(){
		WaitingView("ÕýÔÚµÇÂ¼...");
		var username = document.getElementById("username").value;
		var password = document.getElementById("password").value;
		
		var request = {
			action:"login",
			username:username,
			password:password
		};
		
		chrome.extension.sendMessage(request, function(response){
			if(response.status == "error"){
				alert("Err");
			}else if(response.status == "success"){
				alert("su");
			}
		});
	}
	
	//
	return{
		LoginView : LoginView,
		WaitingView : WaitingView
	};
};

function start(){
	popup = new popup();
	
	var bg = chrome.extension.getBackgroundPage();
	
	if(!bg.chouti.isAuthorized()){
		
		popup.LoginView();
		return;
	}
	popup.WaitingView("Waiting");

};

document.addEventListener("DOMContentLoaded", start);