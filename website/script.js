function initialize()
{
	x = document.getElementById("hey")
	test()

}
function loadpost(){
	const request = new XMLHttpRequest();
	request.onreadystatechange = function(){
		if(this.readyState==4 && this.status == 200)
		{
			sendPosts();
		}
	}
	request.open("GET","pet_diary.js");
	request.send();
}
//i dont know how to access SQL files so I just wrote insert sql pseudo code for now
function getSQL(){
	//var dictionary = *insert sql pseudo code;
	return dictionary
}

function getPosts(){
	var i;
	var list = [];
	var dictionary = getSQL();
	
	for (i = 0; i < dictionary.length; i++) 
	{
		x = new post(dictionary[i].user_name,dictionary[i].type,dictionary[i].name);
		list.push(post)
	}
	
	return list;
}

function sendPosts(){
	/*list = getPosts()
	var i;
	var un 
	var content 
	for(i = 0; i<list.length;i++)
	{
		un = list[i].un;
		if(list[i].type.localeCompare("text")
			content = list[i].content;
		else if(list[i].type.localeCompare("video")
			content = list[i].content;
		else(list[i].type.localeCompare("picture")
			content = list[i].content;		
		x.innerHTML = x.innerHTML + "<div class=\"container\"><div class=\"row col-12\"><div class=\"card-group\"><div class=\"card col-12\"><div class=\"card-body d-flex flex-row\"><img src=\"Profile_placeholder.png\" class=\"rounded-circle mr-3\" height=\"70px\" width=\"70px\" alt=\"avatar\"><div><h4 class=\"card-title font-weight-bold mb-2\"><a href = \"profile2.html\">"+un+"</a></h4></div></div><hr><div class=\"card-body\"><p class=\"card-text\">"+content+"</p></div><div class=\"btn-group btn-group-toggle\" data-toggle=\"buttons\"><label class=\"btn btn-link	 col-9\"><a href=\"item.html\" class=\"btn form-control btn-dark\">View Post</a></label><label class=\"btn btn-link col-2\"><button class=\"btn btn-block btn-success\"><i class=\"fa fa-thumbs-up\">Like</i> </button></label><label class=\"btn btn-link col-1\"><input type=\"\" class=\"form-control\" id=\"likes\" placeholder=\"0\"></label></div></div></div></</div>"
	}*/
}

function test(){
	var i 
	for(i = 0; i<10;i++)
	{
		un = "bob";
		content = "text is here";		
		x.innerHTML = x.innerHTML + "<div class=\"container\"><div class=\"row col-12\"><div class=\"card-group\"><div class=\"card col-12\"><div class=\"card-body d-flex flex-row\"><img src=\"Profile_placeholder.png\" class=\"rounded-circle mr-3\" height=\"70px\" width=\"70px\" alt=\"avatar\"><div><h4 class=\"card-title font-weight-bold mb-2\"><a href = \"profile2.html\">"+un+"</a></h4></div></div><hr><div class=\"card-body\"><p class=\"card-text\">"+content+"</p></div><div class=\"btn-group btn-group-toggle\" data-toggle=\"buttons\"><label class=\"btn btn-link	 col-9\"><a href=\"item.html\" class=\"btn form-control btn-dark\">View Post</a></label><label class=\"btn btn-link col-2\"><button class=\"btn btn-block btn-success\"><i class=\"fa fa-thumbs-up\">Like</i> </button></label><label class=\"btn btn-link col-1\"><input type=\"\" class=\"form-control\" id=\"likes\" placeholder=\"0\"></label></div></div></div></</div>"
	}
}