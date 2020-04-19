function initialize()
{
	post_body = document.getElementById("hey")
	setInterval(getSQL(), 1000);
}


function post(un,type,content,likes, feedID) {
	this.un = un
	this.type = type
	this.content = content
	this.likes = likes
	this.feedID = feedID;
}

function getSQL(){
	var request = new XMLHttpRequest();
	request.onreadystatechange = function(){	
		if	(this.readyState === 4 && this.status === 200){	
			sendPosts(JSON.parse(this.response));
		}	
	};	
	request.open("GET", "/get_feed", true);	
	request.send();
}

function getPosts(hello){
	var i;
	var list = [];
	var dictionary = hello;
	// console.log(dictionary);
	// console.log("####################################");
	// console.log(dictionary.length);

	for (i = 0; i < dictionary.length; i++)
	{
		x = new post(dictionary[i].user_name, dictionary[i].type, dictionary[i].name, dictionary[i].likes, dictionary[i].feed_id);
		console.log(x);
		list.push(x)
	}

	return list;
}

function sendPosts(hello){
	post_body.innerHTML = "";
	list = getPosts(hello);
	console.log(list.length);
	var i;
	var un;
	var content;
	var likes;
	var feedID;
	for(i = 0; i<list.length;i++)
	{
		un = list[i].un;
		console.log(un);
		
		likes = list[i].likes;
		console.log(likes);
		
		if(list[i].type.localeCompare("text")==0){
			content = list[i].content;
		}
			

		if(list[i].type.localeCompare("video")==0){
			content = list[i].content;
		}
			

		if(list[i].type.localeCompare("img")==0){
			imge = list[i].content;
			content = "<img src=\""+ imge + "\">";
			// content = "<img src="+imge+">";
			console.log(content);
		}
		
		feedID = list[i].feedID;
		

		post_body.innerHTML = post_body.innerHTML + "<div class=\"container\"><div class=\"card-group\"><div class=\"card col-12\"><div class=\"card-body d-flex flex-row\"><img src=\"Profile_placeholder.png\" class=\"rounded-circle mr-3\" height=\"70px\" width=\"70px\" alt=\"avatar\"><div><h4 class=\"card-title font-weight-bold mb-2\"><a href = \"profile.html\">"+un+"</a></h4></div></div><hr><div class=\"card-body\"><p class=\"card-text\">"+content+"</p></div><div class=\"btn-group btn-group-toggle\" data-toggle=\"buttons\"><label class=\"btn btn-link  col-7\"><a href=\"item.html?feed_id=" + feedID +"\" class=\"btn form-control btn-dark\">View Post</a></label><label class=\"btn btn-link col-3\"><button class=\"btn btn-block btn-success\"><i class=\"fa fa-thumbs-up\">Like</i> </button></label><label class=\"btn btn-link col-2\"><label type=\"\" class=\"form-control\" id=\"likes\">"+likes+"</label></label></div></div></</div>"
	}
}
/*
function test(){
	var i
	for(i = 0; i<10;i++)
	{
		un = "bob";
		content = "text is here";
		x.innerHTML = x.innerHTML + "<div class=\"container\"><div class=\"card-group\"><div class=\"card col-12\"><div class=\"card-body d-flex flex-row\"><img src=\"Profile_placeholder.png\" class=\"rounded-circle mr-3\" height=\"70px\" width=\"70px\" alt=\"avatar\"><div><h4 class=\"card-title font-weight-bold mb-2\"><a href = \"profile2.html\">"+un+"</a></h4></div></div><hr><div class=\"card-body\"><p class=\"card-text\">"+content+"</p></div><div class=\"btn-group btn-group-toggle\" data-toggle=\"buttons\"><label class=\"btn btn-link	 col-7\"><a href=\"item.html\" class=\"btn form-control btn-dark\">View Post</a></label><label class=\"btn btn-link col-3  \"><button class=\"btn btn-block btn-success\"><i class=\"fa fa-thumbs-up\">Like</i> </button></label><label class=\"btn btn-link col-2\"><input type=\"\" class=\"form-control\" id=\"likes\" placeholder=\"0\"></label></div></div></div>"
	}
}*/

function sendLike(feed_id, number_of_like){
	request = new XMLHttpRequest();
	request.onreadystatechange = function(){	
	    if	(this.readyState	===	4	&&	this.status	===	200){	
	        console.log(this.response);	
	        //	Do	something	with	the	response	
	    }	
	};	
    request.open("POST", "/post_data", true);	
    const formname = document.getElementById("form-name").value;
	const formcomment = document.getElementById("form-comment").value;
	
	//const number_of_like = current_like +/- like or dislike.. .
	//const feed_id 
	let	data = JSON.stringify({'username': formname, 'message': formcomment});	
	request.send(data);
	
    var ti = setTimeout(console.log("post was sent now getting data"), 500);
    clearTimeout(ti);
    getData();
}

