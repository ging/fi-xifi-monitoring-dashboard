// Global Variables

var element = {
			id: "",
			name : "",
			maxVal: 0,
			units : "",
			speedometer: ""
		};

measures = {
		percCPULoad: 0,
		percRAMUsed: 0,
		percDiskUsed: 0
	};

/** Main function.

Through calls to different secondary functions, collects the necessary information about
the virtual machine you want to monitor. Once such data has been collected, draws the
graph of monitoring, on the screen.

Params:
- check_param: key to identify the parameter you want to monitor. 
{Monitoring CPU: 'cpu', Monitoring disk: 'disk', Monitoring RAM: 'mem'}
- divId: id of the div where you want to place the monitoring graphic.
*/

init_vm = function(vm_id, token, tenant, region, check_param, divId){

	element.id = check_param;

	JSTACK.Keystone.init('https://cloud.lab.fi-ware.org/keystone/v2.0/');

	JSTACK.Keystone.authenticate(undefined, undefined, token, tenant, function(resp) {
		
		compute = JSTACK.Keystone.getservice("compute");
		
		for (e in compute.endpoints) {
	    	compute.endpoints[e].publicURL = 'https://cloud.lab.fi-ware.org/' 
	    									  + compute.endpoints[e].region 
	    									  + "/compute" 
	    									  + compute.endpoints[e].publicURL.replace(/.*:[0-9]*/, "");
		}

		getVMProperties(vm_id, region);

		

	}, function (error_msg) {
		var msg = "Widget not working! Athentication failed \n" + error_msg.message + "\n" + error_msg.body;
		console.log(msg);});

	
};


/** Getting parameters of the virtual machine

This function makes an API call to get the parameters of 
the vm's element we want to monitor.
*/

getVMProperties = function(vm_id, region){
	
	var server;
	var flavor;

	//Getting the flavor id
	JSTACK.Nova.getserverdetail(vm_id, function (resp) { server = resp.server;
		//Getting VM parametres (disk.maxValue and ram.maxValue)	
		JSTACK.Nova.getflavordetail(server.flavor.id, function (resp) {
			flavor = resp.flavor;

			switch(element.id){

				case 'cpu':
				element.name = "CPU";
				element.maxVal = 100;
				element.units = "%";
				console.log(element);
				break;

				case 'disk':
				element.name = "DISK";
				element.maxVal = flavor.disk;
				element.units = "GB";
				console.log(element);
				break;

				case 'mem':
				element.name = "RAM";
				element.maxVal = flavor.ram;
				element.units = "MB";
				console.log(element);
				break;

				default:
				console.log(element);
				alert("Error. Can not identify 'check_param' in getVMProperties");

			};

			getVMmeasures();
			element.speedometer = initSpeedometers(divId);
			updateSpeedometers();

			
		},function (error_msg) {
			var msg = "Widget not working! Error while getting flavor details \n" + error_msg.message + "\n Resource not found! Can't identify server id";
			console.log(msg);},region);

	}, function (error_msg) {
		var msg = "Widget not working! Error while getting server details \n" + error_msg.message + "\n Resource not found! Check VM id";
		console.log(msg);}, region);

};


/** Getting monitoring measures

This function makes a call to Monitoring API in order  to collect 
real-time status of the element that we are monitoring. 
*/

getVMmeasures = function() {

	
	// Monitoring.API.getVMmeasures(vm_id, function (resp) {

		// 	measures.percCPULoad = resp.percCPULoad.value;
		// 	measures.percRAMUsed = resp.percRAMUsed.value;
		// 	measures.percDiskUsed = resp.percDiskUsed.value;

	// }, function (error_msg) {
		// 	var msg = "Widget not working! Error while getting VM measures \n" + error_msg.message + "\n" + error_msg.body;
	// 	console.log(msg);}, endPoint);

	measures.percCPULoad = Math.floor(Math.random()*element.maxVal);
	measures.percRAMUsed = Math.floor(Math.random()*element.maxVal);
	measures.percDiskUsed = Math.floor(Math.random()*element.maxVal);
	
};


/** Refreshing monitoring measures
			
*/

refreshData = function() {

	getVMmeasures();
	updateSpeedometers();

};


/** Initializing the monitoring graphic

 */

initSpeedometers = function(divId) {

	id = '#' + divId
	$(id).empty();

	$(id).append(
		$('<div>', {
			id: 'refresh'
		}).append(
			$('<button>', {
				id: 'refresh_button'
			})),
		$('<canvas>', {
			id: 'graphic'
		}));
	
	var speedometer = new Speedometer({elementId: divId, 
										canvasId: 'graphic', 
											size: 300, 
											maxVal: element.maxVal, 
											name: element.name, 
											units: element.units
										});

	$('#refresh_button').on('click', refreshData);

	speedometer.draw();

	return speedometer;

};

/** Updating Monitoring data in the graphic 

*/

updateSpeedometers = function() {

	switch (element.id) {

		case 'cpu':
		//var cpu = Math.round(stats[0].percCPULoad.value);
		element.speedometer.drawWithInputValue(measures.percCPULoad);
		console.log("CPU load = " + measures.percCPULoad + " %");
		break;

		case 'disk':
		//var disk = Math.round(stats[0].percDiskUsed.value);
		element.speedometer.drawWithInputValue(measures.percDiskUsed);
		console.log("Disk use = " + measures.percDiskUsed + " GB");
		break;

		case 'mem':
		//var mem = Math.round(stats[0].percRAMUsed.value);
		element.speedometer.drawWithInputValue(measures.percRAMUsed);
		console.log("RAM use = " + measures.percRAMUsed + " MB");
		break;

		default:
		console.log(element.id);
		alert("Error. Can't identify 'check_param' in updateSpeedometers");
	}
};

