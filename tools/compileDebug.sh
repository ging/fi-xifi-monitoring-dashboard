#!/bin/bash
mkdir ../dist
FILE=../dist/monit_widget.js
rm $FILE
cat ../src/js/lib/encoder.js >> $FILE
cat ../src/js/lib/monitoring_widget.js >> $FILE
cat ../src/js/lib/speedometer.js >> $FILE
cat ../src/js/init_vm.js >> $FILE