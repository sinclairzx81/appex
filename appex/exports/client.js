var appex = {};

appex.call = function (url, data, callback) { 
	var json = JSON.stringify(data, null);
	$.ajax({ 
		url         :  url,
	    type        : 'POST',
	    dataType    : 'json',
	    headers     : {},
	    data        : json,
	    contentType : 'application/json; charset=utf-8',
	    success     : function (data) 
		{
			if(callback) callback(data);
		}
	 });
}