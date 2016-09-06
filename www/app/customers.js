

var vpsCustomers = {
    _lk_data: {}
    ,_lk_return: {}
    ,_lk_total: 0
    ,_lk_page: 1
    ,_lk_new: 0
    ,_target: 0
    ,'lookup': function(){
        vpsCustomers._lk_total = 0;
        vpsCustomers._lk_page = 1;
        vpsCustomers._lk_new = 1;
        vpsCustomers._lk_data = [];
        vpsCustomers._lk_post();
    }
    ,'loadMore': function(){
        vpsCustomers._lk_page++;
        vpsCustomers._lk_post();
        $$('#btn-load-more').addClass('hidden');
    }
    ,'_lk_post': function(){
        params = myApp.formToJSON('#frm-search-customer');
        params.total = vpsCustomers._lk_total;
        params.page = vpsCustomers._lk_page;
        $$('.loading-page').show();
        app.postJSON('customers/list'
            ,params
            ,function(data){
                $$('.loading-page').hide();
                if ('error' in data){
                    app.validToken(data);
                    return false;
                }
                if (!('items' in data)){
                    appPasscode.notify = myApp.addNotification({
                        title: 'Error Data',
                        message:'Invalid data loaded. Please check with system admin.'
                    });
                    return false;
                }

                if (data.items.length == 0){
                    appPasscode.notify = myApp.addNotification({
                        title: 'Not found',
                        message:'No data match.'
                    });
                    return false;
                }
                vpsCustomers._lk_total = data.total;
                vpsCustomers._lk_page = data.page;
                vpsCustomers._lk_return = data.items;

                if (vpsCustomers._lk_new == 1) {
                    mainView.router.loadPage('pages/customer_list.html');
                }else{
                    console.log('list');
                    vpsCustomers.list();
                }
            }
        );
    }

    ,'list': function(){
        txt = '';
        $$.each(this._lk_return,function(index,item){
            txt+= '<li><a class="item-link item-content" href="#" onclick="vpsCustomers.info('+index+')">'
                +'<div class="item-inner"><div class="item-title">'
                +'<i class="fa fa-user"></i> '+item.code+'<br>'
                +'<b>'+item.name+'</b><br>'
                +'<span class="address">'+item.address + (item.address2 != '' ? '<br>'+item.address2 : '')
                +'<br>'+item.suburb+' '+item.state+' '+item.postcode+'</span>'
                +'<br>T: '+item.phone
                +'</div>'
                +'</div></a></li>';
        })
        vpsCustomers._lk_data = vpsCustomers._lk_data.concat(this._lk_return);
        //console.log(txt);
        console.log(this._lk_data.length);
        if (vpsCustomers._lk_new == 1) {
            vpsCustomers._lk_new = 0;

            $$('#page-customer-list').html('<ul>' + txt + '</ul>');
        }else{
           $$('#page-customer-list ul').append( txt );
        }
        $$('.pagination-info').html('View '+vpsCustomers._lk_data.length+' of '+vpsCustomers._lk_total);
        if (vpsCustomers._lk_data.length < vpsCustomers._lk_total){
            $$('#btn-load-more').html('Load 20 more');
            $$('#btn-load-more').removeClass('hidden');
        }else{
            $$('#btn-load-more').addClass('hidden');
        }
    }
    ,'info':function(index){
        vpsCustomers._target = index;
        mainView.router.loadPage('pages/customer_info.html');
    }
    ,'infoBinding':function(){
        var template = $$('#page-customer-info').html();
        var compiledTemplate = Template7.compile(template);
        var html = compiledTemplate(vpsCustomers._lk_data[vpsCustomers._target]);
        $$('#page-customer-info').html(html);

    }
}