#-*-coding:utf-8-*-
from EXPS.models import TermWeekModel,WeekModel,LessonModel,CourseTypeModel,\
    LabModel,RoomModel,AssistantModel
from EXPS.models import SystemSettingModel
from EXPS.models import CourseModel,ArrangementModel
import datetime
import traceback

class UnDisposed(object):
    def weekListOfEmptyAssistantOnArrangement(self,labName=u'未选择'):
        try:
            #print labName
            arrangementInstanceList=ArrangementModel.objects.filter(courseName__lab__name__exact=labName,\
                assistant__name__exact=u'未选择')
            arrangementDictValueList=arrangementInstanceList.values("termWeek__name").distinct()
            weekList=[]
            for item in arrangementDictValueList:
                itemDict={}
                itemDict["termWeek"]=item.get("termWeek__name")
                weekList.append(itemDict)
            #
            return weekList
        except Exception as e:
            estring = traceback.format_exc()
            print estring
    def courseListHasEmptyLocation(self,labName=u'未选择'): #not implement
        try:
            #print labName
            arrangementInstanceList=ArrangementModel.objects.filter(courseName__lab__name__exact=labName,\
                location__name__exact=u'未选择')
            arrangementDictValueList=arrangementInstanceList.values("courseName__courseName").distinct()
            courseList=[]
            for item in arrangementDictValueList:
                itemDict={}
                itemDict["courseName"]=item.get("courseName__courseName")
                courseList.append(itemDict)
            #
            return courseList
        except Exception as e:
            estring = traceback.format_exc()
            print estring


