from __future__ import with_statement
from fabric.api import *
from fabric.contrib.console import confirm

env.user = 'root'
env.hosts = ['192.237.187.62']

def hello():
    print("Hello world!")

def deploy():
    code_dir = '/var/www/devtrac2'
    with cd(code_dir):
        run("git pull")
        run("touch .wsgi")