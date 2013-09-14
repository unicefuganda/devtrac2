#!/bin/sh
sudo varnishd -a 127.0.0.1:4001 -b ec2-54-218-182-219.us-west-2.compute.amazonaws.com:80 -s file,/tmp,500M \
-p thread_pools=4 \
-p thread_pool_max=1500 \
-p listen_depth=2048 \
-p lru_interval=1800 \
-h classic,169313 \
-p connect_timeout=600 \
-p max_restarts=6 \
-s malloc,2G