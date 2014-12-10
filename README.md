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