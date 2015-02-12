#!/bin/bash

java -jar compiler.jar --js ../js/lib/encoder.js --js ../js/lib/jquery-2.1.1.min.js --js ../js/lib/monitoring_widget.js --js ../js/lib/speedometer.js --js ../js/init_vm.js  --js_output_file monit_widget.js
