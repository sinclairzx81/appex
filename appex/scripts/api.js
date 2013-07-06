var appex = appex || {};

appex.headers = {};
appex.header = function(name, value) {
	appex.headers[name] = JSON.stringify(value);
}
appex.get = function (url, callback) {
 	$.ajax({url         : url, 
            type        : 'GET', 
            dataType    : 'json',
            headers     : appex.headers,
            contentType : 'application/json; charset=utf-8', 
            success     : function (data) {
                appex.headers = {};
                if (callback) callback(data);
            }
    });
}