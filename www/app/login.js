var appPasscode = {"key":"","loggedIn":false};
appPasscode.keys = '';
appPasscode.clearNotify = function(){
    if ('notify' in this)  myApp.closeNotification(this.notify);
}
appPasscode.verifyLogin = function(){
    $$('.loading-page').show();
    app.postJSON('login',{action:'login',username:$$('#app-username').val(),password:$$('#app-password').val()}
        ,function(data){
            $$('.loading-page').hide();
            if ('error' in data){
                app.validToken(data);
                return false;
            }
            Lockr.set('token',data);
            userToken = data;
            mainView.router.loadPage('pages/login_set_passcode.html');
        }
    );
}
appPasscode.login = function(){
    this.loggedIn = true;
    mainView.router.loadPage('pages/dashboard.html');
}
appPasscode.clearKeys = function(){
    this.keys = '';
    this.showKeys();
}
appPasscode.showKeys = function(){
    keys = this.keys;

    for (i = 1; i <= 4; i++) {
        if (i <= keys.length) {
            c = '*';
        } else {
            c = '';
        }
        $$('.passcodes .key-' + i + ' .key').html(c);
    }
}
appPasscode.key = function (k,stage) {
    this.clearNotify();
    keys = this.keys;
    this.loggedIn = false;
    if (keys.length >= 4) return;
    //console.log(keys);
    switch (k) {
        case 'back':
            this.keys = '';
            mainView.router.loadPage('pages/login_set_passcode.html');
            return;
            break;
        case 'login':
            this.keys = '';
            mainView.router.loadPage('pages/login.html');
            return;
            break;
        case 'delete':
            if (keys.length == 1) {
                keys = '';
            } else {
                keys = keys.substr(keys.length - 1);
            }
            break;
        default:
            keys += k;
            break;
    }

    if (keys.length == 4) {
        switch(stage){
            case 1: // 1st passcode
                this.tempkey = keys;
                mainView.router.loadPage('pages/login_set_passcode2.html');
                break;
            case 2: // confirm & save passcode
                if (keys == this.tempkey){
                    userToken.passcode = keys;
                    Lockr.set('token',userToken);
                    this.login();
                }else{
                    //mainView.router.loadPage('pages/login_set_passcode.html');
                    appPasscode.notify = myApp.addNotification({
                        title: 'Error Passcode',
                        message:'Please re-enter your passcode correctly'
                    });
                    keys = '';
                }
                break;
            case 0:
                if (keys == userToken.passcode){
                    this.login();
                }else{
                    appPasscode.notify = myApp.addNotification({
                        title: 'Invalid Passcode',
                        message:'Please your passcode again.'
                    });
                    keys = '';
                }
                break;
        }
    }

    this.keys = keys;
    this.showKeys();
}




$$(document).on('pageInit', function (e) {
    var page = e.detail.page;
    // Code for About page
    switch(page.name){
        case 'login-passcode':
            appPasscode.clearKeys();
            $$('.numpad li').on('click', function (e) {
                appPasscode.key($$(this).attr('rel'),0);
            })
            break;
        case 'login-set-passcode':
            appPasscode.clearKeys();
            $$('.numpad li').on('click', function (e) {
                appPasscode.key($$(this).attr('rel'),1);
            })
            break;
        case 'login-set-passcode2':
            appPasscode.clearKeys();
            $$('.numpad li').on('click', function (e) {
                appPasscode.key($$(this).attr('rel'),2);
            })
            break;
        case 'login-screen-embedded':
            Lockr.set('token',{});
            $$('#app-username').on('focus',function(){
                $$(this).val(''); appPasscode.clearNotify();
            });
            $$('#app-password').on('focus',function(){
                $$(this).val(''); appPasscode.clearNotify();
            });

            $$('#frm-login').on('beforeSubmit',function(){
                appPasscode.verifyLogin();
                return false;
            })

            $$('#app-login-btn').on('click', function () {
                if ('notify' in appPasscode)  myApp.closeNotification(appPasscode.notify);
                appPasscode.verifyLogin();
            });
            break;
        case 'customer-lookup':
            $$('#frm-search-customer').on('beforeSubmit',function(){
                vpsCustomers.lookup();
                return false;
            })
            $$('#app-submit-btn').on('click', function () {
                vpsCustomers.lookup();
            });
            break;

    }
});

$$(document).on('pageAfterAnimation', function (e) {
    var page = e.detail.page;
    // Code for About page
    switch(page.name){
        case 'customer-list':
            vpsCustomers.list();
            break;
        case 'customer-info':
            vpsCustomers.infoBinding();
            break;
    }
});

$$(document).on('pageBeforeRemove', function (e) {
    var page = e.detail.page;
    // Code for About page
    switch(page.name){
        case 'login-passcode':
        case 'login-set-passcode':
        case 'login-set-passcode2':
            $$('.numpad li').off('click');
            break;

    }
});

var userToken = Lockr.get('token');
//console.log(userToken);
if (typeof(userToken) != 'undefined' && typeof(userToken.token) != 'undefined' && typeof(userToken.passcode) != 'undefined'){

    mainView.router.loadPage('pages/login_passcode.html');
}else{
    mainView.router.loadPage('pages/login.html');
}