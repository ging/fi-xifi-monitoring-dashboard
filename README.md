fi-xifi-monitoring-dashboard
============================

This library allows you to add to your website, a dynamic graph showing monitoring data of a virtual machine. The displayed data, belongs to percentage measures of the CPU, the Disk or the RAM memory.

It includes: monitoring API, real time monitoring widget and historic monitoring data widget.

For proper operation of the widget it iss necessary to include jquery library in your web site.


-- Example of use --

1 - First of all, clone the repository in your machine.

<pre>
git clone https://github.com/ging/fi-xifi-monitoring-dashboard.git
</pre>

2 - Go to 'tools' directory and run compile.sh. A new monitWidget.js file will be created in dist folder.

<pre>
cd fi-xifi-monitoring-dashboard/tools
./compile.sh
</pre>

3 - Include monitWidget.js in your website (saved in dist/monitWidget.js).

4 - Define the different parameters:

If you are going to initialize real time monitoring widget, this are the params to be set:

<b>vm_id:</b> virtual machine identifier.
<br>
<b>token:</b> user OAuth2 token.
<br>
<b>region:</b> region in which the virtual machine was deployed.
<br>
<b>param:</b> keyword that identifies the machine params to be monitored. Values = ['cpu', 'mem', 'disk']
<br>
<b>divID:</b> div id in which you want to include the widget.
<br>
<b>period:</b> optional parameter. Data refresh period defined in seconds. Default value: undefined.
<br>

From the other side, if you are going to initialize the historic monitoring data widget, this are the params to be set:

<b>vm_id:</b> virtual machine identifier.
<br>
<b>token:</b> user OAuth2 token.
<br>
<b>region:</b> region in which the virtual machine was deployed.
<br>
<b>param:</b> keyword that identifies the machine params to be monitored. Values = ['cpu', 'mem', 'disk']
<br>
<b>divID:</b> div id in which you want to include the widget.
<br>
<b>scale:</b> optional parameter. Keyword that identifies the scale of the graph. Values = ['day', 'week', 'month']. Default value = 'month'.
<br>

5 - Finally, call the main function:

<pre>MonitWidget.RealTime.init(vm_id, token, region, param, divId, period)</pre>
or
<pre>MonitWidget.Historic.init(vm_id, token, region, param, divId, scale)</pre>


6 - That's all!