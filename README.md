fi-xifi-monitoring-dashboard
============================

This function allows you to add to your website a dynamic graph showing monitoring data of a virtual machine.

For proper operation of the function is necessary to know:
- The id of the virtual machine.
- The author access token.
- The region in which the machine has been deployed.
- The parameter you want to monitor ['cpu' 'disk', 'mem']
- The id of the div where we want to include the graphic.

In addition, a refresh button that updates the data for monitoring is also included.

-- Example of use --

1 - First of all, clone the repository in your machine.

2 - Go to 'tools' directory and run compile.sh. A new monit_widget.js file will be created.

3 - Include monit_widget.js in your website.

4 - Define the different parameters:

- var vm_id ='acd468-s85s-asf55-8765411-112589aa3'
- var token = 'aulfbgd7321-32164641-2316863321'
- var region = 'Spain'
- var check_param = 'mem'
- var divId = 'speedometer'

5 - Run the main function:

init_vm(vm_id, token, region, check_param, divId)

6 - That's all!