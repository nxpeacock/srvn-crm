/**
 * Created by nxcong on 26/05/2014.
 */
// Get the current path for URL
curPath=function(){var c=window.location.pathname;var b=c.slice(0,-1);var a=c.slice(-1);if(b==""){return"/"}else{if(a=="/"){return b}else{return c}}};
// Determine if current link should be active
Handlebars.registerHelper('active', function(path) {
    console.log(path);
    return curPath() == path ? 'cActive' : '';
});
