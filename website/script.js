function initialize()
{
	loadpost()
}
//makes a popst class
class post{
  constructor(un, type, content) {
    this.un = un;
    this.type = type;
	this.content = content;
  }
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
	var dictionary = *insert sql pseudo code;
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
	list = getPosts()
	var i;
	//I dont understand the formatting of how the content will be shown and how the video/images will be rendered
	for(i = 0; i<list.length;i++)
	{
		innerhtmlforusername = list[i].un
		if(list[i].type.localeCompare("text")
			innerhtmlfortext = list[i].content	
		if(list[i].type.localeCompare("video")
			innerhtmlforvideo = list[i].content	
		if(list[i].type.localeCompare("picture")
			innerhtmlforpicture = list[i].content		
	}
}