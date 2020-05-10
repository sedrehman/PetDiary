function initialize(){
    getSQLProfile();
}

function openFile() {
    document.getElementById('attachment').click();
}

function profile(user_name, user_id, description, profile_image) {
	this.user_id = user_id
    this.user_name = user_name
    this.description = description
    this.profile_image = profile_image
}

function getProfile(data){
    var i;
	var list = [];
	var dictionary = data;
	for (i = 0; i < dictionary.length; i++)
	{
		x = new post(dictionary[i].user_id, dictionary[i].user_name, dictionary[i].description, dictionary[i].profile_image);
		list.push(x)
	}

	return list;
}

function sendRequest(data){
    post_body.innerHTML = "";
    list = getRequest(data);

    for(i = 0; i < list.length, i++){

        post_body.innerHTML =
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
