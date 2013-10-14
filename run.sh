#!/bin/sh
twistd -n web --port 5000 --wsgi application.app
