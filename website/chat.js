function sendMessage() {
	talk = document.getElementById("message");
	mess = talk.value;
	talk.value = ""
	message = mess
	createText()
	const request = new XMLHttpRequest();
	request.onreadystatechange = function(){
		if(this.readyState==4 && this.status == 200)
		{
		}
	}
	request.open("POST", "WebServer.py");
	request.send(mess);
	talk.focus()
	return false
}

function createText(){
	box = document.getElementById("begginningText");
	b = document.createElement('span')
	b.innerHTML="<div id = \"huh\"><div id = \"text\"><div><span id = \"dname\">Name </span><div id = \"textRecieve\">Message Example</div></div></div></div>"
	box.insertBefore(b,box.firstChild)
}

function getMessages(){
	var request = new XMLHttpRequest();
	request.onreadystatechange = function(){	
		if	(this.readyState === 4 && this.status === 200){	
			sendComments(JSON.parse(this.response));
		}	
	};
	request.open("GET", "/get_messages" + feedid, true);	
	request.send();
}

function getFriends(){
	var request = new XMLHttpRequest();
	request.onreadystatechange = function(){	
		if	(this.readyState === 4 && this.status === 200){	
			sendComments(JSON.parse(this.response));
		}	
	};
	request.open("GET", "/get_friends", true);	
	request.send();
}
