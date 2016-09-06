define(function() {
    var $ = Framework7.$;

    function init() {
        $(document).on('pageBeforeInit', function (e) {
            var page = e.detail.page;
            load(page.name, page.query);
        });
    }

    function load(controllerName, query) {
        require(['js/' + controllerName + '/'+ controllerName + 'Controller'], function(controller) {
            controller.init(query);
        });
    }

    return {
        init: init,
        load: load
    };
}); 