#!/bin/sh
python tests.py && phantomjs jasmine_runner.js http://localhost:5000/static/SpecRunner.html && lettuce
