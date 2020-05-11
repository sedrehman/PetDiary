
function getNotification(){
    var request = new XMLHttpRequest();

    request.onreadystatechange = function(){
		if	(this.readyState === 4 && this.status === 200){	
            console.log("###############################");
            parse_and_apply(this.response);
		}	
    };
    request.withCredentials = true;
	request.open("GET", "/user_notification", true);	
	request.send();
}//profile_info

function parse_and_apply(ress){
    console.log(ress);
    document.getElementById("user_notification").innerText = ress;
}

function removeNotification(){
	var request = new XMLHttpRequest();
    request.withCredentials = true;
	request.open("GET", "/removeNotification", true);	
	request.send();
}