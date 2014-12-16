vm_monitoring_widget
====================

This function allows you to add to your website a dynamic graph showing monitoring data of a virtual machine.

For proper operation of the function is necessary to know:
- The id of the virtual machine.
- The tenant to which it belongs.
- The access token.
- The region in which the machine has been deployed.
- The parameter you want to monitor ['cpu' 'disk', 'mem']
- The id of the div where we want to include the graphic.

In addition, a refresh button that updates the data for monitoring is also included.

-- Example of use --

1. Define the different parameters:

var vm_id ='acd468-s85s-asf55-8765411-112589aa3';

var token = 'aulfb516747321-32164641-23165484863321';

var tenant = '000000000000002315441211';

var region = 'Spain';

var check_param = 'mem';

var divId = 'speedometer';

2. Run the main function:

init_vm(vm_id, token, tenant, region, check_param, divId);

3. That's all!