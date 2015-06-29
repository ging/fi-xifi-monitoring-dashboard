var MonitWidget = MonitWidget || {};

// Current version is **0.1**.

MonitWidget.VERSION = '0.1';

// It has been developed by GING (New Generation Internet Group) in
// the Technical University of Madrid.

// This is an adapted version of the Monitoring API used in the Cloud Portal,
// for the representation of monitoring data in the available widgets.

MonitWidget.AUTHORS = 'GING';


// Monitoring API Module
// ----------------------

// This file module provides functions to access
// to monitoring data, such as real time measures
// and historic measures

MonitWidget.API = (function (_Monitoring, undefined) {

	var monit_url = 'http://130.206.84.4:1028/monitoring/regions/';
	var xmlHead = '<?xml version="1.0" encoding="UTF-8"?>';
	
	var sendRequest = function (method, url, token, body, callback, callbackError) {

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
		
		req.setRequestHeader('Accept', 'application/xml');
	    req.setRequestHeader('Content-Type', 'application/xml');
	    req.setRequestHeader('Authorization', 'Bearer ' + cod_token);
		req.send(body);

	};

	var getVMmeasures = function (id, token, callback, callbackError, region) {


		//http://193.205.211.69:1336/monitoring/regions/Trento/vms/193.205.211.66
		//http://130.206.84.4:1028/monitoring/regions/Trento/vms/vm_uuid


		sendRequest('GET', region + '/vms/' + id, token, undefined, function (resp) {
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
			callback(JSON.parse(resp).measures);
		}, callbackError);
	};

	var getHistoricVMmeasures = function (id, token, callback, callbackError, region) {

		// /monitoring/regions/Poznan/vms/95ddad17_6e69_432c_96bf_34fc5ddc9c31?since=2015-05-03
		// /monitoring/regions/Poznan/vms/95ddad17_6e69_432c_96bf_34fc5ddc9c31?since=2015-05-03T00:00:00

		// all values in last month
		var date = (new Date(new Date().getTime() - (30*24*3600*1000)).toISOString()).substring(0, 19);

		sendRequest('GET', region + '/vms/' + id + '?since=' + date, token, undefined, function (resp) {

			callback(JSON.parse(resp).measures);
		}, callbackError);
	};

    return {
	    getVMmeasures: getVMmeasures,
	    getHistoricVMmeasures: getHistoricVMmeasures
    };
    
}(MonitWidget));


// Real-time Widget
// ----------------

// This module provides a public function that initializes
// the real-time monitoring widget.

MonitWidget.RealTime = (function(_Monitoring, undefined) {

	var session, timer, init, getMeasures, refreshData, drawSpeedometer, updateSpeedometer;

	// 'session' stores info about the widget configuration set by the user, and
	// monitoring measures, while runnig init function
	session = {

		id: "",
		token: "",
		region: "",
		div: "",

		element: {
			id: "",
			name: "",
			speedometer: "",
			period: 0
		},

		measures: {
			percCPULoad: 0,
			percRAMUsed: 0,
			percDiskUsed: 0
		}
	};

	// Main function 
	// --------------

	// Through calls to different secondary functions, collects the necessary information about
	// the virtual machine you want to monitor. Once such data has been collected, draws the
	// graph of monitoring, on the screen.

	// Params:

	// vm_id: ID of the vm you want to monitor.
	// token: author access token.
	// region: node where the vm has been deployed.
	// param: key to identify the parameter you want to monitor. 
	// {Monitoring CPU: 'cpu', Monitoring disk: 'disk', Monitoring RAM: 'mem'}
	// divId: id of the div where you want to place the monitoring graphic.
	// period: optional param. Defines the period , in seconds , of the refresh function. 
	// Set by default as undefined
	
	init = function(vm_id, token, region, param, divId, period) {

		session.id = vm_id;
		session.token = token;
		session.region = region;
		session.div = divId;
		session.element.id = param;
		session.element.period = period || undefined;

		switch(session.element.id) {

			case 'cpu':
				session.element.name = 'CPU Load';
				break;
			case 'disk':
				session.element.name = 'Disk Usage';
				break;
			case 'mem':
				session.element.name = 'Ram Usage';
				break;
		}
		

		getMeasures();
		
	};

	// Getting monitoring measures
	// ----------------------------

	// This function makes a call to Monitoring API in order  to collect 
	// real-time status of the element that we are monitoring. 
	
	getMeasures = function() {

	MonitWidget.API.getVMmeasures(session.id, session.token, function (resp) {
	
			
			var measures = resp[0];

			//console.log('Monitoring API response: ',resp);

			session.measures.percCPULoad = measures.percCPULoad.value;
			session.measures.percRAMUsed = parseInt(measures.percRAMUsed.value);
			session.measures.percDiskUsed = measures.percDiskUsed.value;

			session.element.speedometer = drawSpeedometer();

			updateSpeedometer();

		}, function (error) {
			var msg = "Widget not working! Error while getting VM measures";
			alert(msg);
			console.log(msg, error.message, error.body);
		}, session.region);
	
	
	};

	// Refreshing monitoring measures
	// -------------------------------

	refreshData = function() {

		//console.log('Refreshing monitoring data...');

		getMeasures();
		updateSpeedometer();

	};

	// Initializing the monitoring graphic
	// ------------------------------------

	// This function manipulates the DOM by using jQuery functions, in order to
	// draw the widget graphic, using speedometer.js library.
 
	drawSpeedometer = function() {

		var id, canvas_id, speedometer;

		canvas_id = session.div + '-canvas';

		id = '#' + session.div;
		$(id).empty();

		$(id).append($('<canvas>', {id: canvas_id}),
					 $('<div>', {id: 'refresh'}));

		$('#refresh').append($('<button>', {text: 'Refresh', id: 'refresh_btn'}));
		
		
		speedometer = new Speedometer({elementId: session.div, 
									   canvasId: canvas_id, 
									   size: 300, 
									   maxVal: "100", 
									   name: session.element.name, 
									   units: "%"});

		$('#refresh_btn').on('click', refreshData);

		speedometer.draw();

		if(session.element.period !== undefined) {

			//console.log('Restarting timer...');
			clearInterval(timer);

			//console.log('Setting refresh period to '+ session.element.period + ' seconds...')
			timer = setInterval(function(){refreshData()}, session.element.period*1000);
			
		} else {

			//console.log('Disabled periodical data refreshing');
			clearInterval(timer);
		} 

		return speedometer;

	};

	// Updating Monitoring data in the graphic
	// ----------------------------------------

	updateSpeedometer = function() {

		switch (session.element.id) {

			case 'cpu':
			//var cpu = Math.round(stats[0].percCPULoad.value);
			session.element.speedometer.drawWithInputValue(session.measures.percCPULoad);
			//console.log("CPU load = " + session.measures.percCPULoad + "%");
			break;

			case 'disk':
			//var disk = Math.round(stats[0].percDiskUsed.value);
			session.element.speedometer.drawWithInputValue(session.measures.percDiskUsed);
			//console.log("Disk usage = " + session.measures.percDiskUsed + "%");
			break;

			case 'mem':
			//var mem = Math.round(stats[0].percRAMUsed.value);
			session.element.speedometer.drawWithInputValue(session.measures.percRAMUsed);
			//console.log("RAM usage = " + session.measures.percRAMUsed + "%");
			break;

			default:
			//console.log(session.element.id);
			alert("Error. Can't identify 'param' in updateSpeedometers");
		}
	};

	return {
		init: init
	};

}(MonitWidget));


// Historic Widget
// ----------------

// This module provides a public function that initializes
// the historic monitoring widget.

MonitWidget.Historic = (function(_Monitoring, undefined) {

	var dataset, opt, historic_data, init, getHistoricMeasures, setGraphScale, showChart, refreshData;

	// 'dataset' stores information about the data to be represented and corresponding the format 
	dataset = {
        fillColor : "rgba(151,187,205,0.5)",
        strokeColor : "#099EC6",
        pointColor : "#002E67",
        pointStrokeColor : "#fff"
    };

    // 'opt' stores the diferent options to set the widget graphic
    opt = {
        scaleOverlay : false,
        scaleOverride : false,
        scaleLineColorX : "transparent",
        scaleLineColorY : "#002E67",
        scaleLineWidth : 3,
        scaleFontFamily : "'comfortaa'",
        scaleFontSize : 12,
        scaleFontStyle : "normal",
        scaleFontColorY : "#099EC6",
        scaleFontColorX : "rgb(127,127,127)",
        scaleShowGridLinesX : true,
        scaleShowGridLinesY : false,
        scaleShowMiniLinesY : false,
        scaleGridLineColor : "rgba(0,0,0,.05)",
        scaleGridLineWidth : 2,
        bezierCurve : false,
        pointDot : true,
        pointDotRadius : 4,
        pointDotStrokeWidth : 2,
        datasetStroke : true,
        datasetStrokeWidth : 1,
        datasetFill : false  ,
        animation : true,
        animationSteps : 60,
        animationEasing : "easeOutQuart",
        onAnimationComplete : null
    };

    // 'session' stores info about the widget configuration set by the user, and
	// monitoring measures, while runnig init function
	var session = {

		id: '',
		token: '',
		region: '',
		scale: 'month',
		div: '',

		element: {
			id: ''
		}
	};

	session.element.dataset = {datasets: [jQuery.extend({}, dataset)]};
	session.element.opt = jQuery.extend({}, opt);
	session.element.opt.scaleSteps = null;
    session.element.opt.scaleStepWidth = null;
    session.element.opt.scaleStartValue = null;


	// Main function 
	// --------------

	// Through calls to different secondary functions, collects the necessary information about
	// the virtual machine you want to monitor. Once such data has been collected, draws the
	// graph of monitoring, on the screen.

	// Params:

	// vm_id: ID of the vm you want to monitor.
	// token: author access token.
	// region: node where the vm has been deployed.
	// param: key to identify the parameter you want to monitor. 
	// {Monitoring CPU: 'cpu', Monitoring disk: 'disk', Monitoring RAM: 'mem'}
	// divId: id of the div where you want to place the monitoring graphic.
	// scale: optional param. Key to identify the scale you want to give to the graph.
	// {'day', 'week', 'month'} It is set by default at 'month' 

	init = function(vm_id, token, region, param, divId, scale) {

		session.id = vm_id;
		session.token = token;
		session.region = region;
		session.element.id = param;
		session.div = divId;
		session.scale = scale || 'month';

		getHistoricMeasures();

	};

	// Getting monitoring measures
	// ----------------------------

	// This function makes a call to Monitoring API in order  to collect 
	// historic monitoring data of the element that we are monitoring. 

	getHistoricMeasures = function(){

		MonitWidget.API.getHistoricVMmeasures(session.id, session.token, function(resp){
			
			historic_data = resp;

			setGraphScale();
			drawChart();

		}, function(error){

			var msg = "Widget not working! Error while getting VM historic measures";
			alert(msg);
			console.log(msg, error.message, error.body);

		}, session.region);
	};

	// Setting Widget scale
	// ----------------------------

	// This function rescues from the API call the correct information 
	// based on the set scale.

	setGraphScale = function(){

		if(historic_data && historic_data.length > 0){

			var labels = [];
            var element_data = [];

            var last_hour = historic_data[historic_data.length - 1].timestamp.split('T')[1].split(':')[0];
            var last_day = historic_data[historic_data.length - 1].timestamp.split('T')[0].split('-')[2];
            var last_month = historic_data[historic_data.length - 1].timestamp.split('T')[0].split('-')[1];
            var prev_month = parseInt(last_month, 10) - 1;
			
			switch (session.scale) {
				
				case 'day':
                for (var h = last_hour - 24; h <= last_hour; h = h + 3) {
                    if (h < 0) {
                        labels.push(24 + h + ':00');
                    } else {
                        labels.push(h + ':00');
                    }
                }
                for (var i = historic_data.length - 25; i <= historic_data.length - 1; i = i + 3) {
                    if (historic_data[i]) {

                    	switch (session.element.id) {

                    		case 'cpu':
                    		dataset.title = "Today's CPU use";
                    		element_data.push(historic_data[i].percCPULoad.value);
                    		break;

                    		case 'disk':
                    		dataset.title = "Today's disk use";
                    		element_data.push(historic_data[i].percDiskUsed.value);
                    		break;

                    		case 'mem':
                    		dataset.title = "Today's RAM use";
                    		element_data.push(historic_data[i].percRAMUsed.value);
                    		break;

                    		default:
                    		var msg = 'Widget not working! Unable to identify monitoring param!';
                    		alert(msg);
                    		console.log('Error', msg);
                    		break;
                    	}

                    } else {
                        element_data.push(0);
                    }
                }
                break;

                case 'week':
                for (var d = last_day - 7; d <= last_day; d++) {
                    if (d <= 0) {
                        labels.push(30 + d + '/' + prev_month);
                    } else {
                        labels.push(d + '/' + last_month);
                    }
                }
                for (var j = historic_data.length - 169; j <= historic_data.length; j = j + 24) {
                    if (historic_data[j]) {

                    switch (session.element.id) {

                    	case 'cpu':
                    	dataset.title = "Last week CPU use";
                    	element_data.push(historic_data[j].percCPULoad.value);
                    	break;

                    	case 'disk':
                    	dataset.title = "Last week disk use";
                    	element_data.push(historic_data[j].percDiskUsed.value);
                    	break;

                    	case 'mem':
                    	dataset.title = 'Last week RAM use';
                    	element_data.push(historic_data[j].percRAMUsed.value);
                    	break;

                    	default:
                    	var msg = 'Widget not working! Unable to identify monitoring param!';
                    	alert(msg);
                    	console.log('Error',msg);
                    	break;
                    }

                    } else {
                        element_data.push(0);
                    }
                }
                break;

                case 'month':
                for (var m = last_day - 30; m <= last_day; m++) {
                    if (m <= 0) {
                        labels.push(30 + m + '/' + prev_month);
                    } else {
                        labels.push(m + '/' + last_month);
                    }
                }
                for (var k = historic_data.length - 721; k <= historic_data.length; k = k + 24) {
                    if (historic_data[k]) {

                        switch (session.element.id) {

                    	case 'cpu':
                    	dataset.title = 'Last month CPU use';
                    	element_data.push(historic_data[k].percCPULoad.value);
                    	break;

                    	case 'disk':
                    	dataset.title = 'Last month disk use';
                    	element_data.push(historic_data[k].percDiskUsed.value);
                    	break;

                    	case 'mem':
                    	dataset.title = 'Last month RAM use';
                    	element_data.push(historic_data[k].percRAMUsed.value);
                    	break;

                    	default:
                    	var msg = 'Widget not working! Unable to identify monitoring param!';
                    	alert(msg);
                    	console.log('Error', msg);
                    	break;
                        }

                    } else {
                        element_data.push(0);
                    }
                }
                break;

                default:
                var msg = 'Widget not working! Unable to identify scale of graph!';
                alert(msg);
                console.log('Error', msg);
                break;
            }

            session.element.dataset.labels = labels;
            session.element.dataset.datasets[0].data = element_data;

		}
	};

	// Initializing the monitoring graphic
	// ------------------------------------

	// This function manipulates the DOM by using jQuery functions, in order to
	// draw the widget graphic, using Chart.js library.

	drawChart = function(){

		var id, canvas_id, cnvs_id;

		var ctx = undefined;
		var chart = undefined;

		canvas_id = session.div + '-canvas';

		id = '#' + session.div;
		$(id).empty();

		$(id).append($('<div>', {id: 'refresh_h'}),
					 $('<canvas>', {id: canvas_id}));

		$('#refresh_h').append(dataset.title, $('<button>', {text: 'Refresh', id: 'refresh_btn_h'}));

		$('#refresh_btn_h').on('click', refreshData);

		cnvs_id = '#' + canvas_id;

		ctx = $(cnvs_id).get(0).getContext("2d");
		chart = new Chart(ctx).Line(session.element.dataset, session.element.opt);
		//console.log(chart);

	};

	// Refreshing monitoring measures
	// -------------------------------

	refreshData = function() {

	    getHistoricMeasures();
		
	};

	return {
		init:init
	};

}(MonitWidget));



	