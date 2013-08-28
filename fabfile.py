from __future__ import with_statement
from fabric.api import *
from fabric.contrib.console import confirm

# env.user = 'root'
# env.password = os.environ['DEVTRAC2_QA_PASSWORD']
# env.hosts = ['192.237.187.62']

env.user = 'root'
env.password = os.environ['DEVTRAC2_UAT_PASSWORD']
env.hosts = ['192.237.180.109']

def deploy(char):
    print "deploying char #%s" % char
    code_dir = '/var/www/devtrac2'
    with cd(code_dir):
        run("git fetch origin")
        run("git reset --hard %s" % char)
        run("touch .wsgi")

def bootstrap_chef():
    run("curl -L https://get.rvm.io | bash")
    run("source /etc/profile.d/rvm.sh")
    run("rvm install 1.9.3")
    run("gem install chef ruby-shadow --no-ri --no-rdoc")
    run("sudo apt-get install git")
    run("cd ~/; git clone https://github.com/unicefuganda/devtrac2-provisioning.git")

def provision():
    run("cd ~/devtrac2-provisioning; chef-solo -c solo.rb")