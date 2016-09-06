var api_url = 'https://www.scdlab.com/_apps/bdm/';
var api_key = 'WKRe8PyITn6bRGfeSmDK';

function api_error(jqXHR, textStatus, errorThrown) {
    alert('error '+ textStatus);
    console.log("error " + textStatus);
    console.log("incoming Text " + jqXHR.responseText);
}

var app = {
    'validToken': function(json){
        appPasscode.notify = myApp.addNotification({
            title: 'Error Login',
            message:json.msg
        });

        if (typeof(json)!= 'undefined' && typeof(json.token) != 'undefined'){
            mainView.router.loadPage('pages/login.html');
        }
        return false;
    }
    ,'postJSON':function(url,params,callback){

        userToken = Lockr.get('token');

        if (typeof(userToken) != 'undefined' && typeof(userToken.token) != 'undefined'){
            //_param_ext = {};
            //for(var _param_name in params) _param_ext[_param_name] = params[_param_ext];
            //_param_ext['token'] = userToken.token;
            //params = _param_ext;
            params.token = userToken.token;
        }
        //console.log(params);
        var options = {              //set the defaults
            success: function(data){  //hijack the success handler
                callback(data);   //if pass, call the callback
            }
            ,data:params
            ,method:'post'
            ,dataType:'json'
            ,headers:{'apikey':api_key}
            ,url: api_url+ url

        };
        return $$.ajax(options);             //send request
    }
};


