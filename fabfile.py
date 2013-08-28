from __future__ import with_statement
from fabric.api import *
from fabric.contrib.console import confirm
import os

environments = {
        "QA": {
            "hosts": ['192.237.187.62'],
            "password": os.environ['DEVTRAC2_QA_PASSWORD'],
            "user": 'root'
            },
        "UAT": {
            "hosts": ['192.237.180.109'],
            "password": os.environ['DEVTRAC2_UAT_PASSWORD'],
            "user": 'root'
            }
        }

def e(name):
    env.update(environments[name])
    env.environment = name

def deploy(char):
    print "deploying char %s to %s" % (char, env.environment)
    code_dir = '/var/www/devtrac2'
    with cd(code_dir):
        run("git fetch origin")
        run("git reset --hard %s" % char)
        run("touch .wsgi")
        run("echo \"{'environment':'%s', 'commit':'%s', 'time':''}\" > static/version.json" % (env.environment, char[:6]))

def bootstrap_chef():
    run("curl -L https://get.rvm.io | bash")
    run("source /etc/profile.d/rvm.sh")
    run("rvm install 1.9.3")
    run("gem install chef ruby-shadow --no-ri --no-rdoc")
    run("sudo apt-get -y install git")
    run("cd ~/; git clone https://github.com/unicefuganda/devtrac2-provisioning.git")

def provision():
    run("cd ~/devtrac2-provisioning; chef-solo -c solo.rb")