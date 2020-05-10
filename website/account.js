function initialize(){
    getSQLProfile();
}

function openFile() {
    document.getElementById('attachment').click();
}

function profile(user_name, user_id, description, profile_image, pageuser_id) {
	this.user_id = user_id
    this.user_name = user_name
    this.description = description
    this.profile_image = profile_image
    this.pageuser_id = pageuser_id
}

function getProfile(data){
    var i;
	var list = [];
	var dictionary = data;
	for (i = 0; i < dictionary.length; i++)
	{
		x = new post(dictionary[i].user_id, dictionary[i].user_name, dictionary[i].description, dictionary[i].profile_image, dictionary[i].pageuser_id);
		list.push(x)
	}

	return list;
}

function sendRequest(data){
    post_body.innerHTML = "";
    list = getRequest(data);
    var profileimage = list[0].profile_image;
    var username = list[0].user_name;
    var description = list[0].description;
    var pageuser_id = list[0].pageuser_id;
    var userid = list[0].user_if;
    if(pageuser_id == userid){
        post_body.innerHTML = "<div id=\"profile_wrapper\"><ul id=\"profile_list\"><li><img src="profileimage" alt=\"cuter kitten\" id=\"profile_img\"></li><li id= \"profile_name\"><p id=\"profile_name\">"user_name"</p><br><button>Follow</button></li><li id= \"profile_info\"><p id=\"progile_other\">"description"</p></li></ul></div>"
    }
    else{
        post_body.innerHTML = "<div id=\"profile_wrapper\"><ul id=\"profile_list\"><li><img src="profileimage" alt=\"cuter kitten\" id=\"profile_img\"></li><li id= \"profile_name\"><p id=\"profile_name\">"user_name"</p></li><li id= \"profile_info\"><p id=\"progile_other\">"description"</p></li></ul></div>"
    }
}


function getSQLProfile(){
	var request = new XMLHttpRequest();
	request.onreadystatechange = function(){
		if	(this.readyState === 4 && this.status === 200){
			sendComments(JSON.parse(this.response));
		}
	};
	request.send();
}
