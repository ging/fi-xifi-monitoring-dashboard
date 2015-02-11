var Monitoring = Monitoring || {};

// Current version is **0.1**.

Monitoring.VERSION = '0.1';

// It has been developed by GING (New Generation Internet Group) in
// the Technical University of Madrid.
Monitoring.AUTHORS = 'GING';

Monitoring.API = (function (_Monitoring, undefined) {

	var monit_url = 'http://193.205.211.69:1026/monitoring/regions/';
	var xmlHead = '<?xml version="1.0" encoding="UTF-8"?>';
	
	var sendRequest = function (method, url, body, token, callback, callbackError) {

		var req = new XMLHttpRequest();
		var cod_token = Encoder.Base64.encodeBase64(token);

		req.onreadystatechange = onreadystatechange = function () {

	  		if (req.readyState == '4') {

	  			switch (req.status) {

	                case 100:
	                case 200:
	                case 201:
	                case 202:
	                case 203:
	                case 204:
	                case 205:
	                    //console.log('Respuesta: ', req.responseText);
	    				callback(req.responseText);
	                    break;
	                case 400:
	                    callbackError("400 Bad Request");
	                    break;
	                case 401:
	                    callbackError("401 Unauthorized");
	                    break;
	                case 403:
	                    callbackError("403 Forbidden");
	                    break;
	                default:
	                    callbackError(req.status + " Error" + req.responseText);
                }
	    	}
		}

		req.open(method, monit_url + url, true);
		
		// req.setRequestHeader('Accept', 'application/xml');
	 //    req.setRequestHeader('Content-Type', 'application/xml');
	    req.setRequestHeader('Authorization', 'Bearer ' + cod_token);
		req.send(body);

	};

	var getVMmeasures = function (vm_id, token, callback, callbackError, region) {

		// http://193.205.211.69:1026/monitoring/regions/Trento/vms/193.205.211.66


		sendRequest('GET', region + '/vms/' + vm_id, undefined, token, callback
			
			// var resp = {
			//     "_links": {
			//         "self": { "href": "/monitoring/regions/Trento/hosts/12345/vms/54321" },
			//         "services": { "href": "/monitoring/regions/Trento/vms/54321/services" }
			//     },
			//     "regionid": "Trento",
			//     "vmid": "54321",
			//     "ipAddresses": [
			//             {
			//                "ipAddress": "1.2.3.4"
			//             }
			//         ],
			//     "measures": [
			//         {
			//             "timestamp" : "2013-12-20 12.00",
			//             "percCPULoad": {
			//                 "value": "90",
			//                 "description": "desc"
			//                 },
			//             "percRAMUsed": {
			//                 "value": "500",
			//                 "description": "desc"
			//                 },
			//             "percDiskUsed": {
			//                 "value": "100",
			//                 "description": "desc"
			//                 },
			//             "sysUptime": {
			//                 "value": "123",
			//                 "description": "desc"
			//                 }
			//             }
			//         ],    
			//     "traps": [
			//         {
			//             "description": "desc"
			//         }
			//     ]    
			// };
		
		, callbackError);
	};

    return {
	    getVMmeasures: getVMmeasures,
    };
    
}(Monitoring));