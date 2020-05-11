//sed######2

var friends = []
var messages 
var currentFriend
var user 

function initialize(){
	getUser()
	getFriends();
}

function person(name, id) {
	this.id = id
	this.name = name
}

function getMessages(friend){
	var request = new XMLHttpRequest();
	request.onreadystatechange = function(){	
		if	(this.readyState === 4 && this.status === 200){	
			messages = JSON.parse(this.response);
			createText();
		}	
	};
	request.open("GET", "/get_msg?to="+user.id+"&from="+currentFriend.id+"", true);	
	request.send();
}

function getUser(){

	var request = new XMLHttpRequest();
	request.onreadystatechange = function(){	
		if	(this.readyState === 4 && this.status === 200){	
			//console.log(JSON.parse(this.response));
			console.log(this.response);
			bob = this.response.split("######");
			user = new person(bob[0],bob[1])
		}	
	};
	request.open("GET", "/get_person", true);	
	request.send();
}

function getFriends(){
	var request = new XMLHttpRequest();
	request.onreadystatechange = function(){	
		if(this.readyState === 4 && this.status === 200){	
			parseFriends(this.response);
			createFriends();
		}
	};
	request.open("GET", "/get_friends", true);	
	request.send();
}

function createFriends(){
	//console.log(friends);
	//console.log(friends.length);
	console.log("#############################################");
	console.log(friends.length);
	box = document.getElementById("friendContainer");
	for(var i = 0; i < friends.length; i++){
		console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
		b = document.createElement('span');
		b.innerHTML = "<div id = \"ha\" onclick = \"loadNewMessages('"+friends[i].id+"')\"><div id = \"friend\">"+friends[i].name+"</div></div>";
		box.appendChild(b);
	}
	getMessages(currentFriend);
}

function loadNewMessages(newC){
	for(i =0;i<friends.length;i++)
	{
		if(newC == friends[i].id)
		{
			currentFriend = friends[i];
			break;
		}
	}
	createText()
}

function parseFriends(sup){
	var one = sup.split("#######");
	for(var i =0;i<one.length;i++)
	{
		console.log(i + "~~~");
		var hi = one[i].split("@@@");
		friends.push(new person(hi[0],hi[1]));
	}
	currentFriend = friends[0];
	//getMessages(currentFriend);
}

function createText(){
	box = document.getElementById("begginningText");
//	box.innerHTML = "<div class = \"textContainer\" id = \"begginningText\"></div>"
	b = document.createElement('span');
	
	while (box.firstChild) {
		box.removeChild(box.lastChild);
	}
	
	for(i =0;i<messages.length;i++)
	{
		b.innerHTML="<div id = \"huh\"><div id = \"text\"><div><span id = \"dname\">"+ messages[i].msg+"</span><div id = \"textRecieve\">Message Example</div></div></div></div>"
		box.insertBefore(b,box.firstChild);
	}
}

function sendMessage() {
	talk = document.getElementById("message");
	mess = talk.value;
	talk.value = "";
	oui = mess;
	const request = new XMLHttpRequest();
	request.onreadystatechange = function(){
		if(this.readyState==4 && this.status == 200)
		{
		}
	}
	request.open("POST", "/send_message");
	request.send("/send_message?to="+currentFriend.id+"&to_name="+currentFriend.name+"&from="+user.id+"&from_name="+user.name+"&msg="+oui);
	talk.focus();
	createText();
	return false;
}

/*function getFakeFriends()
{
	friends = [new person ("you",1),new person ("are",2),new person ("my",3),new person ("FRIEND",4)]
}*/