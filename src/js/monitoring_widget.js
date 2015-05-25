// Current version is **0.1**.

Monitoring.VERSION = '0.1';

// It has been developed by GING (New Generation Internet Group) in
// the Technical University of Madrid.

Monitoring.AUTHORS = 'GING';

Monitoring.Widget = (function(_Monitoring, undefined) {

	var session, timer, init, getMeasures, refreshData, drawSpeedometer, updateSpeedometer;

	session = {

		vmID: "",
		token: "",
		region: "",

		change: true,

		element: {
			id: "",
			name: "",
			speedometer: ""
		},

		measures: {
			percCPULoad: 0,
			percRAMUsed: 0,
			percDiskUsed: 0
		}
	};


	/** 

	-- Main function --

	Through calls to different secondary functions, collects the necessary information about
	the virtual machine you want to monitor. Once such data has been collected, draws the
	graph of monitoring, on the screen.

	--Params--

	- vm_id: ID of the vm you want to monitor.
	- token: author access token.
	- region: node where the vm has been deployed.
	- period: defines the period , in seconds , of the refresh function. 
	   It can be set as ' undefined ' if you don't want to refresh the data periodically.
	- monit_param: key to identify the parameter you want to monitor. 
	  {Monitoring CPU: 'cpu', Monitoring disk: 'disk', Monitoring RAM: 'mem'}
	- divId: id of the div where you want to place the monitoring graphic.
	
	*/

	init = function(vm_id, token, region, period, monit_param, divId) {

		session.vmID = vm_id;
		session.token = token;
		session.region = region;
		session.divId = divId;
		session.element.id = monit_param;

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

		if(period !== undefined) {

			console.log('Restarting timer...');
			clearInterval(timer);

			console.log('Setting refresh period to '+ period + ' seconds...')
			timer = setInterval(function(){refreshData()}, period*1000);
		}
		
	};

	/** 

	--Getting monitoring measures--

	This function makes a call to Monitoring API in order  to collect 
	real-time status of the element that we are monitoring. 
	
	*/

	getMeasures = function() {


		session.measures.percCPULoad = 50;
		session.measures.percRAMUsed = 10;
		session.measures.percDiskUsed = 60;

		session.element.speedometer = drawSpeedometer(session.divId);

		updateSpeedometer();

	/**
	Monitoring.API.getVMmeasures(session.vmID, session.token, function (resp) {
	
			console.log('Respuesta sin parsear ', resp);

			var resp = JSON.parse(resp).measures[0];

			console.log('Respuesta parseada ',resp);

			session.measures.percCPULoad = resp.percCPULoad.value;
			session.measures.percRAMUsed = parseInt(resp.percRAMUsed.value);
			session.measures.percDiskUsed = resp.percDiskUsed.value;

			session.element.speedometer = drawSpeedometer(session.divId);

			updateSpeedometer();

		}, function (error_msg) {
			var msg = "Widget not working! Error while getting VM measures \n" + error_msg.message + "\n" + error_msg.body;
			console.log(msg);
		}, session.region);
	*/
	
	};

	/** 

	--Refreshing monitoring measures--
			
	*/

	refreshData = function() {

		console.log('Refreshing monitoring data...');

		getMeasures();
		updateSpeedometer();

	};

	/** 

	--Initializing the monitoring graphic--

 	*/

	drawSpeedometer = function(divId) {

		id = '#' + divId
		$(id).empty();

		$(id).append(
			$('<div>', {
				id: 'refresh'
			}).append(
				$('<button>', {
					text: 'Refresh',
					id: 'refresh_button'
				})),
			$('<canvas>', {
				id: 'graphic'
			}));
		
		var speedometer = new Speedometer({elementId: divId, 
											canvasId: 'graphic', 
												size: 300, 
												maxVal: "100", 
												name: session.element.name, 
												units: "%"
											});

		$('#refresh_button').on('click', refreshData);

		speedometer.draw();

		return speedometer;

	};

	/** 

	--Updating Monitoring data in the graphic --

	*/

	updateSpeedometer = function() {

		switch (session.element.id) {

			case 'cpu':
			//var cpu = Math.round(stats[0].percCPULoad.value);
			session.element.speedometer.drawWithInputValue(session.measures.percCPULoad);
			console.log("CPU load = " + session.measures.percCPULoad + "%");
			break;

			case 'disk':
			//var disk = Math.round(stats[0].percDiskUsed.value);
			session.element.speedometer.drawWithInputValue(session.measures.percDiskUsed);
			console.log("Disk usage = " + session.measures.percDiskUsed + "%");
			break;

			case 'mem':
			//var mem = Math.round(stats[0].percRAMUsed.value);
			session.element.speedometer.drawWithInputValue(session.measures.percRAMUsed);
			console.log("RAM usage = " + session.measures.percRAMUsed + "%");
			break;

			default:
			console.log(session.element.id);
			alert("Error. Can't identify 'monit_param' in updateSpeedometers");
		}
	};

	return {
		init: init
	};


}(Monitoring));











