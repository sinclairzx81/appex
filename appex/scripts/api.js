var appex = appex || {};

appex.get = function (url, callback) 
{
 	$.ajax({url: url, type: 'GET', dataType: 'json', contentType: 'application/json; charset=utf-8', success: function (data) {
 	    if (callback) {
 	        callback(data);
 	    }
    }});
}