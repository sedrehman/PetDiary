function initialize()
{
	post_body = document.getElementById("hey")
	getSQL();
	setInterval(getSQL, 2000);
}


function post(un,type,content,likes, feedID, ide) {
	this.un = un
	this.type = type
	this.content = content
	this.likes = likes
	this.feedID = feedID;
	this.ide = ide;
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

	for (i = dictionary.length-1; i >-1; i--)
	{
		x = new post(dictionary[i].user_name, dictionary[i].type, dictionary[i].name, dictionary[i].likes, dictionary[i].feed_id,dictionary[i].id);
		//console.log(x);
		list.push(x)
	}

	return list;
}

function sendPosts(hello){
	post_body.innerHTML = "";
	list = getPosts(hello);
	//console.log(list.length);
	var i;
	var un;
	var content;
	var likes;
	var feedID;
	for(i = 0; i<list.length;i++)
	{
		un = list[i].un;
		//console.log(un);
		
		likes = list[i].likes;
		//console.log(likes);
		
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
			//console.log(content);
		}
		
		feedID = list[i].feedID;
		ide = list[i].ide;
		

		post_body.innerHTML = post_body.innerHTML + "<div class=\"container\"><div class=\"card-group\"><div class=\"card col-12\"><div class=\"card-body d-flex flex-row\"><img src=\"Profile_placeholder.png\" class=\"rounded-circle mr-3\" height=\"70px\" width=\"70px\" alt=\"avatar\"><div><h4 class=\"card-title font-weight-bold mb-2\"><a href=\"profile.html?ide=" + ide +"\">"+un+"</a></h4></div></div><hr><div class=\"card-body\"><p class=\"card-text\">"+content+"</p></div><div class=\"btn-group btn-group-toggle\" data-toggle=\"buttons\"><label class=\"btn btn-link  col-7\"><a href=\"item.html?feed_id=" + feedID +"\" class=\"btn form-control btn-dark\">View Post</a></label><label class=\"btn btn-link col-3\"><button class=\"btn btn-block btn-success\"    onclick=\"sendLike("+ feedID + ","+ likes + ")\"    ><i class=\"fa fa-thumbs-up\">Like</i> </button></label><label class=\"btn btn-link col-2\"><label type=\"\" class=\"form-control\" id=\"likes\">"+likes+"</label></label></div></div></</div>"
	}
}


function sendLike(feed_id, number_of_like){
	console.log("here "+ feed_id);
	console.log(number_of_like);
	request = new XMLHttpRequest();
	request.onreadystatechange = function(){	
		if	(this.readyState === 4 && this.status === 200){	
			
		}	
	};	
    request.open("POST", "/set_likes?feed_id="+feed_id +"&likes="+number_of_like, true);	
	
	request.send("");

}

