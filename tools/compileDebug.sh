#!/bin/bash
mkdir ../dist
FILE=../dist/monitWidget.js
rm $FILE
cat ../src/js/lib/encoder.js >> $FILE
cat ../src/js/lib/Chart.js >> $FILE
cat ../src/js/lib/speedometer.js >> $FILE
cat ../src/js/lib/jquery-2.1.1.min.js >> $FILE
cat ../src/js/monitWidget.js >> $FILE