/**
 * Created by tphan on 31/08/2016.
 */
/*
requirejs(["helper/util"], function(util) {
    //This function is called when scripts/helper/util.js is loaded.
    //If util.js calls define(), then this function is not fired until
    //util's dependencies have loaded, and the util argument will hold
    //the module value for "helper/util".
});
    */

var requireQueue = function(modules, callback) {
    function load(queue, results) {
        if (queue.length) {
            require([queue.shift()], function(result) {
                results.push(result);
                load(queue, results);
            });
        } else {
            callback.apply(null, results);
        }
    }

    load(modules, []);
};

requireQueue([
    'libs/lockr',
    'router',
    'my-conf',
    'my-app',
    'login',
    'customers'

], function(App) {
    //App.start();
});
