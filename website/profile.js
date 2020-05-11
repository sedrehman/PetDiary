var friends = []
var currentFriend
var user 
var personProfile

function initialize(){
	getUser()
	getFriends();
	getBio();
}

function person(name, id) {
	this.id = id
	this.name = name
} 

function getUser(){

	var request = new XMLHttpRequest();
	request.onreadystatechange = function(){	
		if	(this.readyState === 4 && this.status === 200){	
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
		}
	};
	request.open("GET", "/get_friends", true);	
	request.send();
}

function getBio(){
	var request = new XMLHttpRequest();
	request.onreadystatechange = function(){	
		if(this.readyState === 4 && this.status === 200){	
			createBio(JSON.parse(this.response));
		}
	};
	var ide = document.URL;
	var idx = ide.indexOf("ide");
	ide = ide.slice(idx+8, ide.length);
	request.open("GET", "/getInfo?ide="+ide, true);	
	request.send();
}

function parseFriends(sup){
	var one = sup.split("######");
	for(var i =0;i<one.length;i++)
	{
		var hi = one[i].split("@@@");
		friends.push(new person(hi[0],hi[1]));
	}
}

function createBio(help){
	help = help[0];
	box = document.getElementById("profile_wrapper");
	b = document.createElement('span');
	b.innerHTML="<ul id=\"profile_list\"><li id= \"profile_name\"><p id=\"profile_name\">"+help.name+"</p></li><div class = \"col 5\"><li ><img src=\"images/blank-profile-picture.png\" alt=\"images/blank-profile-picture.png\" id=\"profile_img\"></li></div><li id= \"profile_info\"><p id=\"progile_other\">"+help.bio+"</p></li></ul>"
	box.insertBefore(b,box.firstChild);
}

function sendFriendRequest() {
	const request = new XMLHttpRequest();
	request.onreadystatechange = function(){
		if(this.readyState==4 && this.status == 200)
		{
		}
	}
	request.open("POST", "/follow?ide="+ide);
	request.send();
	return false;
}