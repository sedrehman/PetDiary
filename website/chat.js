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

function getMessages(){
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
			console.log(this.response);
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
}

function loadNewMessages(newC){
	alert(newC);
	for(i =0;i<friends.length;i++)
	{
		if(newC == friends[i].id)
		{
			currentFriend = friends[i];
			break;
		}
	}
}

function parseFriends(sup){
	var one = sup.split("######");
	console.log(one);
	for(var i =0;i<one.length;i++)
	{
		console.log(i + "~~~");
		var hi = one[i].split("@@@");
		friends.push(new person(hi[0],hi[1]));
	}
	currentFriend = friends[0];
	getMessages();
	setInterval(getMessages, 5000);
	//getMessages(currentFriend);
}

function createText(){
	box = document.getElementById("begginningText");
//	box.innerHTML = "<div class = \"textContainer\" id = \"begginningText\"></div>"
	remove()
	for(i =0;i<messages.length;i++)
	{
		b = document.createElement('span');
		b.innerHTML="<div id = \"huh\"><div id = \"text\"><div><span id = \"dname\">"+ messages[i].from_name+"</span><div id = \"textRecieve\">"+messages[i].msg+"</div></div></div></div>"
		box.insertBefore(b,box.firstChild);
	}
}

function remove(){
	box = document.getElementById("begginningText");
	while (box.firstChild) {
		box.removeChild(box.lastChild);
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
	request.open("POST", "/send_message?to="+currentFriend.id+"&to_name="+currentFriend.name+"&from="+user.id+"&from_name="+user.name+"&msg="+oui);
	request.send();
	talk.focus();
	createText();
	return false;
}
