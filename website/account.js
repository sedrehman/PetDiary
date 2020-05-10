function initialize(){
    getSQLProfile();
}

function openFile() {
    document.getElementById('attachment').click();
}

function profile(username, user_id, description, profile_image) {
	this.user_id = user_id
    this.username = username
    this.description = description
    this.profile_image = profile_image
}
