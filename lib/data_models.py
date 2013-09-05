from mongoengine import *

class District(Document):
  index_name = StringField()
  name = StringField()
  area = StringField()
  subregion = StringField()

  

  # @property
  # def serialize(self):   
  #   return {
  #     "name" : self.name,
  #     "area" : self.area,
  #     "subregion" : self.subregion
  #   }
    
class School():
  def __init__(self,id,district,subcounty,name,use_status):
    self.id = id    
    self.district = district
    self.subcounty = subcounty
    self.name = name
    self.use_status = use_status
