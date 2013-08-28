from __future__ import with_statement
from fabric.api import *
from fabric.contrib.console import confirm

env.user = 'root'
env.password = "hrFtFi9pP7iF"
env.hosts = ['192.237.187.62']

def deploy(char):
    print "deploying char #%s" % char
    code_dir = '/var/www/devtrac2'
    with cd(code_dir):
        run("git fetch origin")
        run("git reset --hard %s" % char)
        run("touch .wsgi")