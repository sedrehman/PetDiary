function initialize()
{
	post_body = document.getElementById("hey")
	post_comments = document.getElementById("hi")
	//setInterval(getSQL(), 1000);
// test()
// test2()
	getSQLPost();
	getSQLComments();
}


function post(un,type,content,likes, feedID) {
	this.un = un
	this.type = type
	this.content = content
	this.likes = likes
	this.feedID = feedID;
}

function comment(un,content) {
	this.un = un
	this.content = content
}

function getSQLPost(){
	var request = new XMLHttpRequest();
	request.onreadystatechange = function(){	
		if	(this.readyState === 4 && this.status === 200){	
			sendPosts(JSON.parse(this.response));
		}	
	};	
	var feedid = document.URL;
	var idx = feedid.indexOf("feed_id");
	feedid = feedid.slice(idx+8, feedid.length);
	request.open("GET", "/get_single_feed?feed_id=" + feedid, true);	
	request.send();
}

function getSQLComments(){
	var request = new XMLHttpRequest();
	request.onreadystatechange = function(){	
		if	(this.readyState === 4 && this.status === 200){	
			sendComments(JSON.parse(this.response));
		}	
	};
	var feedid = document.URL;
	var idx = feedid.indexOf("feed_id");
	feedid = feedid.slice(idx+8, feedid.length);
	request.open("GET", "/get_comments?feed_id=" + feedid, true);	
	request.send();
}

function getPosts(hello){
	var i;
	var list = [];
	var dictionary = hello;
	for (i = 0; i < dictionary.length; i++)
	{
		x = new post(dictionary[i].user_name, dictionary[i].type, dictionary[i].name, dictionary[i].likes, dictionary[i].feed_id);
		console.log(x);
		list.push(x)
	}

	return list;
}

function sendPosts(hello){
	list = getPosts(hello);

	var un = "error";
	var content = "error";

	un = list[0].un;
	console.log(un);

	if(list[0].type.localeCompare("text")==0){
		content = list[0].content;
	}
	if(list[0].type.localeCompare("video")==0){
		content = list[0].content;
	}
	if(list[0].type.localeCompare("img")==0){
		imge = list[0].content;
		content = "<img src=\""+ imge + "\">";
		console.log(content);
	}

	post_body.innerHTML ="<div class=\"card-body d-flex flex-row\"><img src=\"Profile_placeholder.png\" class=\"rounded-circle mr-3\" height=\"70px\" width=\"70px\" alt=\"avatar\"><div><h4 id = \"uName\" class=\"card-title font-weight-bold mb-2\">"+un+"</h4></div></div><hr><div class=\"card-body\"><p id = \"postC\" class=\"card-text\">"+content+"</p></div>"

}

function getComments(hello){
	var i;
	var list = [];
	var dictionary = hello;
	for (i = 0; i < dictionary.length; i++)
	{
		x = new comment(dictionary[i].username, dictionary[i].comment);
		console.log(x);
		list.push(x)
	}

	return list;
}


function sendComments(hello){
	post_comments.innerHTML = "";
	list = getComments(hello);
	console.log(list);
	var i;
	var un;
	var content;
	for(i = 0; i<list.length;i++)
	{
		un = list[i].un;
		content = list[i].content;

		post_comments.innerHTML = post_comments.innerHTML +"<div id = \"usercomment\"><div class=\"card-group d-flex\"><div class=\"card flex-fill border-0\"><div class=\"card-body flex-row\"><div class=\"card-body\"><h5 class=\"card-title font-weight-bold mb-2\">"+un+"</h5><p class=\"card-text\">"+content+"</p><hr></div></div></div></div></div>"
	}
}

/*
function test(){
	post_body.innerHTML = "";
	//list = getPosts(hello);
	//console.log(list.length);
	var un;
	var content;
	var likes;
	var feedID;
		un = "hi"
		content = "bye"
		

		post_body.innerHTML ="<div class=\"card-body d-flex flex-row\"><img src=\"Profile_placeholder.png\" class=\"rounded-circle mr-3\" height=\"70px\" width=\"70px\" alt=\"avatar\"><div><h4 id = \"uName\" class=\"card-title font-weight-bold mb-2\">"+un+"</h4></div></div><hr><div class=\"card-body\"><p id = \"postC\" class=\"card-text\">"+content+"</p></div>"
}

function test2(){
	post_comments.innerHTML = "";
	var i;
	var un;
	var content;

	for(i = 0; i<10;i++)
	{
		un = "person"
		content = "very cool"

		post_comments.innerHTML = post_comments.innerHTML +"<div id = \"usercomment\"><div class=\"card-group d-flex\"><div class=\"card flex-fill border-0\"><div class=\"card-body flex-row\"><div class=\"card-body\"><h5 class=\"card-title font-weight-bold mb-2\">"+un+"</h5><p class=\"card-text\">"+content+"</p><hr></div></div></div></div></div>"
	}
}*/