#!/bin/bash
FILE=monit_widget.js
rm $FILE
cat ../js/lib/encoder.js >> $FILE
cat ../js/lib/monitoring_widget.js >> $FILE
cat ../js/lib/speedometer.js >> $FILE
cat ../js/init_vm.js >> $FILE