var chouti = (function(){

	var appKey = "c40fe2f61bcfd611177be71ec305196b";
	var appSecret = "5c585c08a597c23d";
	var signUrl = "http://api.gozap.com/xauth/access_token";
	var tokenUrl = "http://api.gozap.com/xauth/access_token";
	var apiUrl = "http://api.chouti.com";
	
	function isAuthorized(){
		return (localStorage.token && localStorage.username);
	}
	
	function logout(){
		localStorage.removeItem("token");
		localStorage.removeItem("username");
	}
	
	function createUUID() {
		// http://www.ietf.org/rfc/rfc4122.txt
		var s = [];
		var hexDigits = "0123456789abcdef";
		for (var i = 0; i < 36; i++) {
			s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
		}
		s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
		s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
		s[8] = s[13] = s[18] = s[23] = "-";

		var uuid = s.join("");
		return uuid;
	}
	
	function login(user, pass, callbacks){
		try{
			var formStr = "oauth_consumer_key=" + encodeURIComponent(appKey);
			formStr += "&oauth_nonce=" + encodeURIComponent(createUUID());
			formStr += "&oauth_signature_method=HMAC-SHA1&oauth_timestamp=" + parseInt(new Date().getTime()/1000);
			formStr += "&oauth_version=1.0&x_auth_model=client_auth&x_auth_password=" + encodeURIComponent(pass);
			formStr += "&x_auth_username=" + encodeURIComponent(user);

			var baseString = "POST&" + encodeURIComponent(signUrl) + "&" + encodeURIComponent(formStr);
			var secret = appSecret + "&";
			var signature = CryptoJS.HmacSHA1(baseString, secret);
			var base64 = CryptoJS.enc.Base64.stringify(signature);
			formStr += "&oauth_signature=" + encodeURIComponent(base64);
			
			$.ajax({
				url:tokenUrl,
				type:"POST",
				data:formStr,
				success:function(data){
					//
					parser = new DOMParser().parseFromString(data, "text/xml");
					var code = parser.getElementsByTagName("code")[0].childNodes[0].nodeValue;
					//
					if(code == 200){
						var access_token = parser.getElementsByTagName("access_token")[0].childNodes[0].nodeValue
						//alert(access_token);
						localStorage["username"] = user;
						localStorage["token"] = access_token;
						callbacks.success();
					}else{
						//alert(code);
						var message = parser.getElementsByTagName("message")[0].childNodes[0].nodeValue;
						callbacks.error({error:message});
					}
				},
				error:function(xhr){
					//alert(xhr.readyState);
					callbacks.error({error:xhr.readyState});
				}
			});
		}catch(e){
			alert(e.message);
		}
	}
	
	function show(url, callbacks){
		try{
			var showUrl = apiUrl;
			showUrl += "/links/show.json?url=";
			showUrl += encodeURIComponent(url);
			if(isAuthorized()){
				showUrl += "&access_token=";
				showUrl += appKey;
				showUrl += localStorage.token;
			}else{
				showUrl += "&source=";
				showUrl += appKey;
			}
		
			//alert(showUrl);
			$.ajax({
				url:showUrl,
				success:function(data){
					alert("ups:"+data.link.ups);
				},
				error:function(jqXHR, textStatus, errorThrown){
					alert(errorThrown);
				}
			});
		}catch(e){
			alert(e.message);
		}
	}

	return{
		isAuthorized : isAuthorized,
		login : login,
		logout : logout,
		show : show
	};
}());