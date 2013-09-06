from __future__ import with_statement
from fabric.api import *
from fabric.contrib.console import confirm
from fabric.contrib.files import upload_template
from time import localtime, strftime
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

def deploy(sha):
    print "deploying %s to %s" % (sha, env.environment)
    code_dir = '/var/www/devtrac2'

    with cd(code_dir):
        run("git fetch origin")
        run("git reset --hard %s" % sha)
        
        run("pip install -r requirements.txt --use-mirrors")
        run("python db/import_districts.py")
        upload_template("version.template", "static/javascript/version.json", { "environment": env.environment, "sha": sha[:6], "time": strftime("%d %b %Y %X", localtime()) })
        run("touch .wsgi")

def bootstrap_chef():
    run("curl -L https://get.rvm.io | bash")
    run("source /etc/profile.d/rvm.sh")
    run("rvm install 1.9.3")
    run("gem install chef ruby-shadow --no-ri --no-rdoc")
    run("sudo apt-get -y install git")
    run("cd ~/; git clone https://github.com/unicefuganda/devtrac2-provisioning.git")

def provision():
    run("cd ~/devtrac2-provisioning/; git pull -r")
    run("cd ~/devtrac2-provisioning; chef-solo -c solo.rb")