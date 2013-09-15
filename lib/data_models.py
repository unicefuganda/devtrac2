from mongoengine import *

class District(Document):
    index_name = StringField()
    name = StringField()
    area = StringField()
    subregion = StringField()
    geometry = DictField()
    subcounties = ListField()
    unicef = StringField()

        
class School():
    def __init__(self,id,district,subcounty,name,use_status):
        self.id = id    
        self.district = district
        self.subcounty = subcounty
        self.name = name
        self.use_status = use_status
