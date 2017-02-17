#-*-coding:utf-8-*-
from EXPS.models import TermWeekModel,WeekModel,LessonModel,CourseTypeModel,\
    LabModel,RoomModel,AssistantModel
from EXPS.models import SystemSettingModel
from EXPS.models import CourseModel,ArrangementModel
import datetime
import pickle

class System(object):
    def Init(self,lastTermWeek=18,termBeginDate=datetime.date.today()):
        self._clearAllDatabaseTable()
        self._initEmptyDataBaseTable()
        #save of modify termBeginDate  recoder
        recoderInstance,created=SystemSettingModel.objects.get_or_create(key="termBeginDate")
        recoderInstance.value=termBeginDate.strftime("%Y-%m-%d")
        recoderInstance.save()
        #generate termWeek,week,lesson the basic data
        for i in range(1,lastTermWeek+1):
            termWeekName=u"第"+str(i)+u"周"
            termWeekNickName=i
            instance,created=TermWeekModel.objects.get_or_create(name=termWeekName,nickName=termWeekNickName)
            instance.save()
        for i in range(1,8):
            weekName=u"周"+str(i)
            weekNickName=i
            instance,created=WeekModel.objects.get_or_create(name=weekName,nickName=weekNickName)
            instance.save()
        for i in range(0,5): #1-2节,3-4节,5-6节...,9-10节
            lessonName=str((2*i)+1)+u"-"+str((2*i)+2)+u"节"
            lessonNickName=(2*i)+1
            instance,created=LessonModel.objects.get_or_create(name=lessonName,nickName=lessonNickName)
            instance.save()
        courseTypeList=[u"实验",u"课程设计",u"上机"]
        for index,item in enumerate(courseTypeList):
            CourseTypeModel.objects.get_or_create(name=item,nickName=index+1)
        #generate data finished
    
    def getEnvironmentVariable(self,keyList):#keyList is something like this ["name","data"]
        if not isinstance(keyList,list):
            raise Exception("argument is not string list in System.getSystemSetting !")
        #the data will be put in this dict
        keyValueDict={}
        #get the termBeginDate,which is date format !
        for key in keyList:
            kvInstance, created=SystemSettingModel.objects.get_or_create(key=key)
            if not created:
                keyValueDict[key]=kvInstance.value
        #return the dict
        return keyValueDict
    #set the key,value dict in database or update
    def setEnvironmentVariables(self,**kwargs):
        keyList=[]
        for key,value in kwargs.iteritems():
            keyList.append(key)
            kvInstance, created=SystemSettingModel.objects.get_or_create(key=key)
            kvInstance.value=value
            kvInstance.save()
        return self.getEnvironmentVariable(keyList)
    def _initEmptyDataBaseTable(self):
        TermWeekModel.objects.get_or_create(name=u"未选择",nickName=0)
        WeekModel.objects.get_or_create(name=u"未选择",nickName=0)
        LessonModel.objects.get_or_create(name=u"未选择",nickName=0)
        CourseTypeModel.objects.get_or_create(name=u"未选择",nickName=0)
        #RoomModel and AssistantModel has lab forgien key
        labInstance, created=LabModel.objects.get_or_create(name=u"未选择",nickName=0)
        RoomModel.objects.get_or_create(name=u"未选择",lab=labInstance,nickName=0)
        AssistantModel.objects.get_or_create(name=u"未选择",phone=u"未选择",\
            lab=labInstance)
    def _clearAllDatabaseTable(self):
        #delete all data in the table
        TermWeekModel.objects.all().delete()
        WeekModel.objects.all().delete()
        LessonModel.objects.all().delete()
        CourseTypeModel.objects.all().delete()
        LabModel.objects.all().delete()
        RoomModel.objects.all().delete()
        AssistantModel.objects.all().delete()
        #the recoder
        CourseModel.objects.all().delete()
        ArrangementModel.objects.all().delete()
        #clear settings
        SystemSettingModel.objects.all().delete()


        
