function request(receiver_id,sender_id,sender_username) {
	this.receiver_id = receiver_id
	this.sender_id = sender_id
	this.sender_username = sender_username
}

function getRequest(data){
	var i;
	var list = [];
	var dictionary = data;
    var req_string = dictionary[i].requests
    var lst_str = 0;
	for (cur_str = 0; cur_str < req_string.length; i++)
	{
        if (req_string[i] == '#'){
            if(str.substring(cur_str, lst_str) == "######"){
                x = new request(dictionary[i].receiver_id, dictionary[i].sender_id, dictionary[i].sender_username);
                list.push(x);
                lst_str = i + 6;
                i = lst_str
            }
            else{
                i = i + 1;
            }
        }
        else{
            i = i + 1;
        }
	}
	return list;
}

function sendRequest(data){


    post_body.innerHTML =
}

function getSQLRequest(){
	var request = new XMLHttpRequest();
	request.onreadystatechange = function(){
		if	(this.readyState === 4 && this.status === 200){
			sendRequest(JSON.parse(this.response));
		}
	};
}
