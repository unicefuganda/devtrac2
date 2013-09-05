from data_models import *
import pymongo
from pymongo import MongoClient

from flask import Flask
from flask.ext.mongoengine import MongoEngine


class DistrictService(object):  

  def find_by_name(self, name):
    return District.objects(index_name=name.upper()).first()
    

  def find_all(self):
    return District.objects().all().order_by("name")