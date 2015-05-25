fi-xifi-monitoring-dashboard
============================

This widget allows you to add to your website a dynamic graph showing monitoring data of a virtual machine.

For proper operation of the widget is necessary to know:
- The id of the virtual machine.
- The user Oauth2 token (access token).
- The region in which the machine has been deployed.
- The period defined in seconds, for the execution of the refresh function.
<blockquote>Set it as <code>undefined</code>, if you want to disable periodical execution.</blockquote>
- The parameter you want to monitor ['cpu' 'disk', 'mem']
- The id of the div where you want to include the graphic.

In addition, a refresh button that updates the data for monitoring is included.

-- Example of use --

1 - First of all, clone the repository in your machine.

<pre>
git clone https://github.com/ging/fi-xifi-monitoring-dashboard.git
</pre>

2 - Go to 'tools' directory and run compile.sh. A new monit_widget.js file will be created.

<pre>
cd fi-xifi-monitoring-dashboard/tools
./compile.sh
</pre>

3 - Include monit_widget.js in your website (saved in dist/monit_widget.js).

4 - Define the different parameters:

- var vm_id ='adsds4-s85s-asf55-8723411-2232334'
- var token = 'aulfbgd732fdfdgdgfdsd12334516863321'
- var region = 'Spain'
- var check_param = 'mem'
- var divId = 'speedometer'

5 - Call the main function:

<pre>init_vm(vm_id, token, region, check_param, divId)</pre>


6 - That's all!