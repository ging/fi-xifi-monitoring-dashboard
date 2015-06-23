#!/bin/bash

mkdir ../dist
java -jar compiler.jar --js ../src/js/lib/encoder.js --js ../src/js/lib/jquery-2.1.1.min.js --js ../src/js/lib/speedometer.js --js ../src/js/lib/Chart.js --js ../src/js/monitWidget.js  --js_output_file ../dist/monitWidget.js
