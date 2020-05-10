function initialize(){
    getSQLRequest();
}


function request(sender_username, sender_id) {
	this.sender_username = sender_username
    this.sender_id = sender_id
}

function getRequest(data){
	var list = [];
    var req_string = data
    var lst_str = 0;
	for (cur_str = 0; cur_str < req_string.length)
	{
        if (req_string[i] == '#'){
            if(req_string.substring(cur_str, cur_str + 5) == "######"){
                var cur = cur_str + 6;
                while(req_string[cur] != '@'){
                    cur = cur + 1
                }
                x = new request(req_string.substring(lst_str,cur_str),req_string.substring(cur_str + 6,cur));
                list.push(x);
                lst_str = cur_str + 6;
                cur_str = lst_str
            }
            else{
                cur_str = cur_str + 1;
            }
        }
        else{
            cur_str = cur_str + 1;
        }
	}
	return list;
}

function sendRequest(data){
    post_body.innerHTML = "";
    list = getRequest(data);
    var usrname;

    for(i = 0; i < list.length, i++){

        post_body.innerHTML = post_body.innerHTML + "<div class=\"card-group\"> <div class=\"card col-12\"> <div class=\"btn-group btn-group-toggle\" data-toggle=\"buttons\"><div class = \"col-4 centered\"><h3>"usrname"</h3></div><label class=\"btn btn-link col-4\"><button class=\"btn btn-block btn-success\"><i class=\"fa fa-thumbs-up\">Accept</i> </button></label><label class=\"btn btn-link col-4\"><button class=\"btn btn-block btn-danger\"><i class=\"fa fa-thumbs-up\">Reject</i> </button></label></div></div></div>"
    }
}

function getSQLRequest(){
	var request = new XMLHttpRequest();
	request.onreadystatechange = function(){
		if	(this.readyState === 4 && this.status === 200){
			sendRequest(JSON.parse(this.response));
		}
	};
    var userid = document.URL;
    var idx = userid.indexOf("user");
    userid = ;
    request.open("GET", "/get_requests?user=" + userid, true);
    request.send();
}
