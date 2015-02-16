#!/bin/bash

java -jar compiler.jar --js ../src/js/lib/encoder.js --js ../src/js/lib/jquery-2.1.1.min.js --js ../src/js/lib/monitoring_widget.js --js ../src/js/lib/speedometer.js --js ../src/js/init_vm.js  --js_output_file ../dist/monit_widget.js
