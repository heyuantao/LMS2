#-*-coding:utf-8-*-
from django.db.models import Q  
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser
from rest_framework import authentication, permissions
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from models import TermWeekModel, WeekModel, LessonModel, LabModel, CourseTypeModel, AssistantModel, RoomModel
from models import CourseModel, ArrangementModel
from serializers import TermWeekModelSerializer, WeekModelSerializer, LessonModelSerializer, LabModelSerializer, CourseTypeModelSerializer,\
     RoomModelSerializer
from EXPS.lib.system import System
from EXPS.lib.undisposed import UnDisposed
import time
import json
from distutils.util import strtobool
import traceback

# Create your views here.
class LoginView(APIView):
    def post(self, request, format=None):
        try:
            usernameString=request.data.get("username")
            passwordString=request.data.get("password")
            user = authenticate(username=usernameString, password=passwordString)
            if user is not None:
                login(request, user)
                if (user.profilemodel.userType==u"Administrator")or(user.is_superuser):
                    return Response({"id": user.id, "username": user.username,"userType":"Administrator"})
                if user.profilemodel.userType==u"Teacher":
                    return Response({"id": user.id, "username": user.username,"userType":"Teacher"})
                if user.profilemodel.userType==u"Assistant":
                    return Response({"id": user.id, "username": user.username,"userType":"Assistant"})
                else:
                    return Response({"id": user.id, "username": user.username,"userType":"Guest"})
            else:
                return Response({"error": u"用户登录失败"}, status=400)
        except User.DoesNotExist:
            return Response({}, status=400)

class LogoutView(APIView):
    def post(self, request, format=None):
        if request.user.is_authenticated:
            logout(request)
            print "logout"
            return Response({"status": "logout"})
        else:
            print "logout error "
            return Response({"status": "already logout"}, status=400)

class RegisterView(APIView):
    def post(self, request, format=None):
        try:
            usernameString = request.data.get("username")
            passwordString = request.data.get("password")
            emailString = request.data.get("email")
            user, created = User.objects.get_or_create(username=usernameString, email=emailString)
            if created:
                user.set_password(passwordString)
                user.save()
                return Response({"username": usernameString, "password": passwordString, "email": emailString})
            else:
                return Response({"error":"用户注册失败"}, status=400)
        except Exception:
            return Response({"error":"用户注册失败"}, status=400)

#当用户打开页面后，SPA会请求当前用户信息
class UserStateView(APIView):
    def get(self, request, format=None):
        try:
            if request.user.is_authenticated:
                print "user has logined"
                user = request.user
                #check the user type and return
                if (user.profilemodel.userType==u"Administrator")or(user.is_superuser):
                    return Response({"id": user.id, "username": user.username,"userType":"Administrator"})
                elif user.profilemodel.userType==u"Teacher":
                    return Response({"id": user.id, "username": user.username,"userType":"Teacher"})
                elif user.profilemodel.userType==u"Assistant":
                    return Response({"id": user.id, "username": user.username,"userType":"Assistant"})
                else:
                    return Response({"id": user.id, "username": user.username,"userType":"Teacher"})
            else:
                print "Guest user !"
                return Response({},status=400)
        except Exception as e:
            estring = traceback.format_exc()
            print estring
            return Response({}, status=400)
#infrastructure data
class TermWeekListView(APIView):
    def get(self, request, format=None):
        termWeekList=TermWeekModel.objects.filter(~Q(name="未选择"))
        termWeekListSerialized=TermWeekModelSerializer(termWeekList,many=True)
        return Response(termWeekListSerialized.data)
        #return JSONResponse(termWeekListSerialized.data)

class WeekListView(APIView):
    def get(self, request, format=None):
        weekList = WeekModel.objects.filter(~Q(name="未选择"))
        weekListSerialized = WeekModelSerializer(weekList, many=True)
        return Response(weekListSerialized.data)
        #return JSONResponse(weekListSerialized.data)

class LessonListView(APIView):
    def get(self, request, format=None):
        lessonList = LessonModel.objects.filter(~Q(name="未选择"))
        lessonListSerialized = LessonModelSerializer(lessonList, many=True)
        return Response(lessonListSerialized.data)
        #return JSONResponse(lessonListSerialized.data)

class LabListView(APIView):
    def get(self, request, format=None):
        labList = LabModel.objects.filter(~Q(name="未选择"))
        labListSerialized = LabModelSerializer(labList, many=True)
        return Response(labListSerialized.data)
        #return JSONResponse(labListSerialized.data)
    def post(self, request, format=None):
        try:
            serializer = LabModelSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response({error:u"添加数据出错"}, status=400)
        except Exception as e:
            estring = traceback.format_exc()
            print estring
            return Response({}, status=400)
#
class LabDetailView(APIView):
    def put(self, request, id, format=None):
        try:
            labInstance=LabModel.objects.get(id=id)
            serializer = LabModelSerializer(labInstance,data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response({error:u"修改数据出错"}, status=400)
        except Exception as e:
            estring = traceback.format_exc()
            print estring
            return Response({}, status=400)
    def delete(self, request, id, format=None):
        try:
            labInstance=LabModel.objects.get(id=id)
            labInstance.delete()
            return Response({})
        except Exception as e:
            estring = traceback.format_exc()
            print estring
            return Response({}, status=400)
#
class CourseTypeListView(APIView):
    def get(self, request, format=None):
        courseTypeList = CourseTypeModel.objects.filter(~Q(name="未选择"))
        courseTypeListSerialized = CourseTypeModelSerializer(courseTypeList, many=True)
        return Response(courseTypeListSerialized.data)
        #return JSONResponse(courseTypeListSerialized.data)
#
class AssistantListView(APIView):
    def get(self, request, format=None):
        try:
            needPagination=bool(strtobool(request.GET.get("needPagination","False")))
            pageSize = int( request.GET.get("pageSize", u"10") )
            pageNumber = int( request.GET.get("pageNumber", u"1") )
            lab = request.GET.get("lab", u"未选择")             
            #这个值要返回到json中
            assistantInstanceList = AssistantModel.objects.exclude(lab__name__exact="未选择")
            #筛选实验室
            if lab!=u"未选择":
                assistantInstanceList = assistantInstanceList.filter(lab__name__exact=lab)              
            #是否进行分页处理
            assistantInstanceListLength=len(assistantInstanceList) 
            if needPagination==False:
                assistantInstanceList = assistantInstanceList    
            else:#分页查询
                assistantInstanceList=assistantInstanceList[pageSize*(pageNumber-1):pageSize*pageNumber] #分页查看
            
            #生成json字符串
            assistantList=[]
            for item in assistantInstanceList:
                assistant={}
                assistant["id"]=item.id
                assistant["name"]=item.name
                assistant["phone"]=item.phone
                assistant["lab"]=item.lab.name                
                assistantList.append(assistant)
            #assistantListSerialized = AssistantModelSerializer(assistantInstanceList, many=True)

            paginationDict={"totalItem":assistantInstanceListLength,"pageNumber":pageNumber,"pageSize":pageSize,"needPagination":needPagination}
            wrapperDict={}
            #print assistantListSerialized.data
            wrapperDict["pagination"]=paginationDict
            wrapperDict["data"]=assistantList
            json = JSONRenderer().render( wrapperDict )
            return HttpResponse(json)
        except Exception as e:
            estring = traceback.format_exc()
            print estring
            return Response({"traceback":estring}, status=400)
    def post(self, request, format=None):
        try:
            name = request.data.get("name") 
            phone = request.data.get("phone")
            labInstance = LabModel.objects.get(name= request.data.get("lab",u"未选择") )
            assistantInstance=AssistantModel.objects.create(name=name,phone=phone,lab=labInstance)
            return Response({})
        except Exception as e:
            estring = traceback.format_exc()
            print estring
            return Response({"traceback":estring}, status=400)
#
class AssistantDetailView(APIView):
    def delete(self, request, id, format=None):
        try:
            assistantInstance=AssistantModel.objects.get(id=id)
            assistantInstance.delete()
            return Response({})
        except Exception as e:
            estring = traceback.format_exc()
            print estring
            return Response({"error":u"删除数据出错","traceback":estring}, status=400)
    def put(self, request, id, format=None):
        try:
            name=request.data.get("name")
            phone=request.data.get("phone")
            labInstance=LabModel.objects.get(name=request.data.get("lab",u"未选择"))
            assistantInstance=AssistantModel.objects.get(id=id)
            #update the recorder
            assistantInstance.name=name;assistantInstance.phone=phone
            assistantInstance.lab=labInstance
            assistantInstance.save()
            self._updateArrangementAssistant(assistantInstance)
            return Response({})   
        except Exception as e:
            estring = traceback.format_exc()
            print estring
            return Response({"error":u"修改数据出错","traceback":estring}, status=400)
    #当修改某个值班学生所在的实验中心后，该学生原有的安排就无效了
    def _updateArrangementAssistant(self,assistantInstance):
        arrangementInstanceList=ArrangementModel.objects.filter(assistant=assistantInstance)
        emptyAssistant=AssistantModel.objects.get(name=u"未选择")
        arrangementInstanceList.update(assistant=emptyAssistant)
#
class RoomListView(APIView):
    def get(self, request, format=None):
        try:
            needPagination=bool(strtobool(request.GET.get("needPagination","True")))
            pageSize = int( request.GET.get("pageSize", u"10") )
            pageNumber = int( request.GET.get("pageNumber", u"1") )
            labName = request.GET.get("lab", u"未选择")
            
            roomInstanceList = RoomModel.objects.filter(~Q(name="未选择"))
            if labName!=u"未选择":                
                roomInstanceList = roomInstanceList.filter(lab__name__exact=labName)
            else:
                roomInstanceList=roomInstanceList
            
            roomInstanceListLength=len(roomInstanceList)
            #进行分页
            if needPagination==True:
                roomInstanceList=roomInstanceList[pageSize*(pageNumber-1):pageSize*pageNumber]
            else:
                roomInstanceList=roomInstanceList
            #生成字典
            roomList=[]
            for roomInstance in roomInstanceList:
                item={};
                item["id"]=roomInstance.id;item["name"]=roomInstance.name
                item["lab"]=roomInstance.lab.name;item["nickName"]=roomInstance.nickName
                roomList.append(item)

            wrapperDict={}
            paginationDict={"totalItem":roomInstanceListLength,"pageNumber":pageNumber,"pageSize":pageSize,"needPagination":needPagination}
            wrapperDict["pagination"]=paginationDict
            wrapperDict["data"]=roomList
            json = JSONRenderer().render( wrapperDict )
            return HttpResponse(json)
        except Exception:
            estring = traceback.format_exc()
            print estring
            return Response({}, status=400)
    def post(self, request, format=None):
        try:
            name=request.data.get("name")
            labInstance=LabModel.objects.get(name=request.data.get("lab",u"未选择"))
            nickName=int(request.data.get("nickName"))
            roomInstance,created=RoomModel.objects.get_or_create(name=name,lab=labInstance,nickName=nickName)
            roomInstance.save()
            return Response({})   
        except Exception:
            estring = traceback.format_exc()
            print estring
            return Response({}, status=400)   



#
class RoomDetailView(APIView):
    def get(self, request, id, format=None):
        return Response({error:u"方法未实现"},status=400)
    def delete(self, request, id, format=None):
        try:
            RoomInstance=RoomModel.objects.get(id=id)
            RoomInstance.delete()
            return Response({})   
        except Exception as e:
            estring = traceback.format_exc()
            print estring
            return Response({"traceback":estring}, status=400)
    def put(self, request, id, format=None):
        try:
            name=request.data.get("name")
            labInstance=LabModel.objects.get(name=request.data.get("lab",u"未选择"))
            nickName=int(request.data.get("nickName"))
            roomInstance=RoomModel.objects.get(id=id)
            roomInstance.name=name;roomInstance.lab=labInstance;roomInstance.nickName=nickName
            roomInstance.save()
            return Response({})   
        except Exception as e:
            estring = traceback.format_exc()
            print estring
            return Response({"error":u"修改数据出错","traceback":estring}, status=400)
#
class CourseListView(APIView):
    #当添加一门课程时的处理函数
    def post(self,request,format=None):
        #id = request.data.get("id",-1) #add a new course ,so id is -1
        user = request.user  #obj
        courseName = request.data.get("experimentName","")
        lab = LabModel.objects.get(name=request.data.get("lab","未选择"))
        theoryClass = request.data.get("theoryClass","")
        teacher = request.data.get("teacher","")
        studentGrade = request.data.get("studentGrade",0)
        studentSubject = request.data.get("studentSubject","")
        studentNumber = request.data.get("studentNumber",0)
        courseType = CourseTypeModel.objects.get(name=request.data.get("courseType",-1)) #obj
        needAssistant = request.data.get("needAssistant",True)
        extra = request.data.get("extra","")
        experimentTotalCourePeriod = request.data.get("experimentTotalCourePeriod",0)
        experimentTotalCourseCount = request.data.get("experimentTotalCourseCount",0)
        #保存course信息
        courseInstance=CourseModel.objects.create(user=user,courseName=courseName,theoryClass=theoryClass,teacher=teacher,lab=lab, \
                                   studentGrade=studentGrade,studentSubject=studentSubject,studentNumber=studentNumber,\
                                   courseType=courseType,needAssistant=needAssistant,extra=extra,\
                                   experimentTotalCourePeriod=experimentTotalCourePeriod,\
                                   experimentTotalCourseCount=experimentTotalCourseCount)
        courseInstance.save();
        #保存课程上课时间信息
        arrangements = request.data.get("arrangements","[]")
        for item in arrangements:
            try:
                termWeek = TermWeekModel.objects.get(name=item.get("termWeek","未选择"))
                week = WeekModel.objects.get(name=item.get("week","未选择"))
                lesson = LessonModel.objects.get(name=item.get("lesson","未选择"))
                name = item.get("arrangementName","")
                #检查是否有教室和助理安排
                location = RoomModel.objects.get(name=item.get("location","未选择"))
                assistant = AssistantModel.objects.get(name=item.get("assistant","未选择"))
                #根据是否有上课地点和值班助理保存时间安排信息
                arrangmentInstance = ArrangementModel.objects.create( courseName=courseInstance,\
                        termWeek=termWeek, week=week, lesson=lesson, name=name, location=location, assistant=assistant)
               
                arrangmentInstance.save()
                #print "save arrangement ok "
            except Exception:
                return Response({}, status=400)
        return Response({})
    #当查看课程列表时的处理函数
    def get(self,request,format=None):
        try:
            pageSize=int(request.GET.get("pageSize","10"))
            needPagination=bool(strtobool(request.GET.get("needPagination","False")))   
            pageNumber = int( request.GET.get("pageNumber", u"1") )

            lab = request.GET.get("lab", u"未选择") 
            username= request.GET.get("username", u"未选择") 
            #list all course
            courseList=CourseModel.objects.all()
            if lab!=u"未选择":
                courseList=courseList.filter(lab__name__exact=lab)
            #如果get请求提供了用户名，则返回指定用户的课程，课程名称和request.user应当一致
            if request.user.is_superuser:
                courseList=courseList
            elif (username!=u"未选择")and(request.user.username==username):
                courseList=courseList.filter(user__username__exact=username)

            courseListLength=len(courseList) #这个值要返回到json中
            courseList=courseList[pageSize*(pageNumber-1):pageSize*pageNumber] #分页查看

            courseListString=[]
            for item in courseList:
                oneItem={}
                oneItem['id']=item.id ; oneItem['name']=item.courseName; oneItem['grade']=item.studentGrade
                oneItem['major'] = item.studentSubject; oneItem['teacher']=item.teacher ;oneItem['type']=item.courseType.name
                oneItem['lab'] = item.lab.name
                courseListString.append(oneItem)
            #添加分页信息
            pagination={"totalItem":courseListLength,"pageNumber":pageNumber,"pageSize":pageSize,"needPagination":needPagination}
            wrapperDict={}
            wrapperDict["pagination"]=pagination
            wrapperDict["data"]=courseListString
            json = JSONRenderer().render( wrapperDict )
            return HttpResponse(json)
        except Exception:
            return Response({}, status=400)


#
class CourseDetailView(APIView):
    def get(self, request, id, format=None):
        try:
            courseInstance=CourseModel.objects.get(id=id)
            arrangementInstanceList=ArrangementModel.objects.filter(courseName=courseInstance)
            courseDict={}
            courseDict["id"]=courseInstance.id
            courseDict["lab"]=courseInstance.lab.name
            courseDict["experimentName"]=courseInstance.courseName
            courseDict["theoryClass"]=courseInstance.theoryClass
            courseDict["teacher"]=courseInstance.teacher
            courseDict["studentSubject"]=courseInstance.studentSubject
            courseDict["studentGrade"]=courseInstance.studentGrade
            courseDict["studentNumber"]=courseInstance.studentNumber
            courseDict["courseType"]=courseInstance.courseType.name
            courseDict["needAssistant"]=courseInstance.needAssistant
            courseDict["extra"]=courseInstance.extra
            courseDict["experimentTotalCourePeriod"]=courseInstance.experimentTotalCourePeriod
            courseDict["experimentTotalCourseCount"]=courseInstance.experimentTotalCourseCount

            arrangementsList=[]
            for item in arrangementInstanceList:
                arrangementItemDict={}
                arrangementItemDict["id"]=item.id
                arrangementItemDict["termWeek"]=item.termWeek.name
                arrangementItemDict["week"]=item.week.name
                arrangementItemDict["lesson"]=item.lesson.name
                arrangementItemDict["name"]=item.name
                arrangementItemDict["location"]=item.location.name
                arrangementItemDict["assistant"]=item.assistant.name
                arrangementsList.append(arrangementItemDict)
            courseDict["arrangements"]=arrangementsList

            json = JSONRenderer().render( courseDict )
            return HttpResponse(json)
        except Exception as e:
            estring = traceback.format_exc()
            print estring
            return Response({}, status=400)

    def put(self, request, id, format=None):
        try:
            courseDict=request.data
            courseInstance=CourseModel.objects.get(id=id)
            courseInstance.lab=LabModel.objects.get(name=courseDict.get("lab","未选择"))
            courseInstance.courseName=courseDict.get("experimentName")
            courseInstance.theoryClass=courseDict.get("theoryClass")
            courseInstance.teacher=courseDict.get("teacher")
            courseInstance.studentSubject=courseDict.get("studentSubject")
            courseInstance.studentGrade=courseDict.get("studentGrade")
            courseInstance.studentNumber=courseDict.get("studentNumber")
            courseInstance.courseType=CourseTypeModel.objects.get(name=courseDict.get("courseType","未选择"))
            courseInstance.needAssistant=courseDict.get("needAssistant")
            courseInstance.extra=courseDict.get("extra")
            courseInstance.experimentTotalCourePeriod=courseDict.get("experimentTotalCourePeriod")
            courseInstance.experimentTotalCourseCount=courseDict.get("experimentTotalCourseCount")
            courseInstance.save()
            arrangementDictList=courseDict.get("arrangements","[]")
            #store the origin id list
            originIdList=[]
            originArrangementList=ArrangementModel.objects.filter(courseName=courseInstance)
            for originItem in originArrangementList:
                originIdList.append(originItem.id)
            newIdList=[] #id list was update and create
            #用post中的arrangements数据来更新数据库，新增的条目和修改的条目在如下循环中处理
            for item in arrangementDictList:
                id=int(item.get("id","-1"))
                if id>-1:
                    arrangementInstance=ArrangementModel.objects.get(id=item.get("id"))                    
                else:
                    arrangementInstance=ArrangementModel()
                arrangementInstance.courseName=courseInstance
                arrangementInstance.termWeek=TermWeekModel.objects.get(name=item.get("termWeek","未选择"))
                arrangementInstance.week=WeekModel.objects.get(name=item.get("week","未选择")) 
                arrangementInstance.lesson=LessonModel.objects.get(name= item.get("lesson","未选择"))
                arrangementInstance.name=item.get("name","")
                arrangementInstance.location=RoomModel.objects.get(name=item.get("location","未选择")) 
                arrangementInstance.assistant=AssistantModel.objects.get(name=item.get("assistant","未选择"))
                
                arrangementInstance.save()
                newIdList.append(arrangementInstance.id) #save id which was update or created
            #delete the item not update or created
            for id in originIdList:
                if id not in newIdList:
                    ArrangementModel.objects.filter(id=id).delete() #avoid to throw exception
            
            json = JSONRenderer().render({})
            return HttpResponse(json)
        except Exception as e:
            estring = traceback.format_exc()
            print estring
            return Response({}, status=400)
    def delete(self, request, id, format=None):
        try:
            courseInstance=CourseModel.objects.get(id=id) 
            courseInstance.delete() #相关的arrangement有models中定义的post_delete处理
            return Response({})
        except Exception:
            return Response({}, status=400)

#
class ArrangementsListView(APIView):
    def get(self,request,format=None):
        try:
            pageSize = int( request.GET.get("pageSize", u"10") )
            pageNumber = int( request.GET.get("pageNumber", u"1") )
            lab = request.GET.get("lab", u"未选择") 
            #print "pageSize:",pageSize
            #print "pageNumber:",pageNumber
            arrangementInstanceList=ArrangementModel.objects.all()
            #根据是否选择了实验室进行筛选
            if lab!=u"未选择":
                arrangementInstanceList=arrangementInstanceList.filter(courseName__lab__name__exact=lab)
            #这个值要返回到json中
            arrangementInstanceListLength=len(arrangementInstanceList) 
            arrangementInstanceList=arrangementInstanceList[pageSize*(pageNumber-1):pageSize*pageNumber] #分页查看
            #生成json字符串
            arrangementList=[]
            for item in arrangementInstanceList:
                arrangementDict={}
                arrangementDict["id"]=item.id
                arrangementDict["course"]=item.courseName.courseName
                arrangementDict["termWeek"]=item.termWeek.name
                arrangementDict["week"]=item.week.name
                arrangementDict["lesson"]=item.lesson.name
                arrangementDict["name"]=item.name
                arrangementDict["location"]=item.location.name
                arrangementDict["assistant"]=item.assistant.name
                arrangementList.append(arrangementDict)

            #添加分页信息
            wrapperDict={}
            paginationDict={"totalItem":arrangementInstanceListLength,"pageNumber":pageNumber,"pageSize":pageSize}
            wrapperDict["data"]=arrangementList
            wrapperDict["pagination"]=paginationDict
            json = JSONRenderer().render( wrapperDict )
            return HttpResponse(json)
        except Exception as e:
            estring = traceback.format_exc()
            print estring
            return Response({},status=400)

#
class SystemSettingsView(APIView):
    def __init__(self):
        super(SystemSettingsView, self).__init__()
        self.System=System()
        self.environmentVariableList=["termBeginDate","term","notification"]
    #get methods
    def get(self,request,format=None):
        try:
            keyList=self.environmentVariableList
            keyValueDict=self.System.getEnvironmentVariable(keyList)
            json = JSONRenderer().render( keyValueDict )
            return HttpResponse(json)
        except Exception as e:
            estring = traceback.format_exc()
            print estring
            json = JSONRenderer().render( {})
            return HttpResponse(json, status=400)
    def post(self,request,format=None):
        try:
            postData=request.data
            settingDict={}
            for key,value in postData.items():
                if key not in self.environmentVariableList:
                    continue
                settingDict[key]=postData.get(key)
            #print "setting"
            print self.environmentVariableList
            changedDict=self.System.setEnvironmentVariables(**settingDict)
            json = JSONRenderer().render(changedDict)
            return HttpResponse(json)
        except Exception as e:
            estring = traceback.format_exc()
            print estring
            return Response({}, status=400)
#
#
class RoomUseageView(APIView): #所有房间的信息
    def get(self,request,format=None):
        try:
            pageSize=int(request.GET.get("pageSize","10"))
            needPagination=bool(strtobool(request.GET.get("needPagination","False")))

            labName=request.GET.get("lab",u"未选择")
            termWeekName=request.GET.get("termWeek",u"未选择") #maybe empty
            weekName=request.GET.get("week",u"未选择")#maybe empty
            lessonName=request.GET.get("lesson",u"未选择")#maybe empty
            
            arrangementInstanceList=ArrangementModel.objects.filter(courseName__lab__name__exact=labName)
            #如果周次、周、节次有一个为空，就不针对该列筛选
            if termWeekName!=u"未选择":
                arrangementInstanceList=arrangementInstanceList.filter(termWeek__name__exact=termWeekName)
            if weekName!=u"未选择":
                arrangementInstanceList=arrangementInstanceList.filter(week__name__exact=weekName)
            if lessonName!=u"未选择":
                arrangementInstanceList=arrangementInstanceList.filter(lesson__name__exact=lessonName)
            #处理数据
            arrangementList=[]
            for item in arrangementInstanceList:
                itemDict={}
                itemDict["termWeek"]=item.termWeek.name
                itemDict["week"]=item.week.name
                itemDict["lesson"]=item.lesson.name
                itemDict["location"]=item.location.name
                arrangementList.append(itemDict)
            #no pagination information
            pagination={"totalItem":len(arrangementInstanceList),"pageSize":pageSize,"pageNumber":1}  
            wrapperDict={}            
            wrapperDict["pagination"]=pagination
            wrapperDict["data"]=arrangementList
            json = JSONRenderer().render(wrapperDict)
            return HttpResponse(json)
        except Exception as e:
            estring = traceback.format_exc()
            print estring
            return Response({}, status=400)


class AssistantArrangementView(APIView): #学生助理信息，
    #改函数返回指定实验中心和周次是的课程，在相同时间上课的课程会显示为一个
    def get(self,request,format=None):
        try:#仅接受周次和实验中心的信息
            needPagination=bool(strtobool(request.GET.get("needPagination","False")))
            pageSize=int(request.GET.get("pageSize","10"))

            termWeekName=request.GET.get("termWeek",u"未选择")
            labName=request.GET.get("lab",u"未选择")

            arrangementInstanceList=ArrangementModel.objects.filter(courseName__lab__name__exact=labName).\
                filter(termWeek__name__exact=termWeekName)
            arrangementInstanceList=arrangementInstanceList.values("week__name", "lesson__name","assistant__name").distinct()
            #print arrangementInstanceList
            arrangementsList=[]
            for item in arrangementInstanceList:
                #print item
                arrangementItemDict={}
                arrangementItemDict["week"]=item.get("week__name")
                arrangementItemDict["lesson"]=item.get("lesson__name")
                arrangementItemDict["assistant"]=item.get("assistant__name")
                arrangementsList.append(arrangementItemDict)


            wrapperDict={}
            pagination={"totalItem":len(arrangementsList),"pageSize":pageSize,"pageNumber":1}
            wrapperDict["pagination"]=pagination
            wrapperDict["data"]=arrangementsList
            json = JSONRenderer().render(wrapperDict)
            return HttpResponse(json)
        except Exception as e:
            estring = traceback.format_exc()
            print estring
            return Response({}, status=400)
    def put(self,request,format=None):
        try:#
            termWeekName=request.data.get("termWeek",u"未选择")
            weekName=request.data.get("week",u"未选择")
            lessonName=request.data.get("lesson",u"未选择")
            labName=request.data.get("lab",u"未选择")
            #update fields
            assistantName=request.data.get("assistant",u"未选择")
            assistantInstance=AssistantModel.objects.get(name=assistantName)

            ArrangementInstanceList=ArrangementModel.objects.filter(termWeek__name__exact=termWeekName,\
                week__name__exact=weekName,lesson__name__exact=lessonName,\
                courseName__lab__name__exact=labName)
            print "length"
            print len(ArrangementInstanceList)
            result=ArrangementInstanceList.update(assistant=assistantInstance)
            print "result"
            print result
            json = JSONRenderer().render({})
            return HttpResponse(json)
        except Exception as e:
            estring = traceback.format_exc()
            print estring
            return Response({}, status=400)
#返回系统检查的信息，例如那些周没有安排值班，那些课没有安排教室
class UnDisposedItemsView(APIView): 
    def get(self,request, type, format=None):
        try:#仅接受实验中心的信息
            labName=request.GET.get("lab",u"未选择")
            if type=='weeklistofemptyassistantonarrangement':
                weekList=UnDisposed().weekListOfEmptyAssistantOnArrangement(labName=labName)
                json = JSONRenderer().render(weekList)
            elif type=='courselisthasemptylocation':
                courseList=UnDisposed().courseListHasEmptyLocation(labName=labName)
                json = JSONRenderer().render(courseList)                
            else:
                json = JSONRenderer().render({})
            return HttpResponse(json)
        except Exception as e:
            estring = traceback.format_exc()
            print estring
            return Response({}, status=400)
    
#class JSONResponse(HttpResponse):
#    def __init__(self, data, **kwargs):
#        content = JSONRenderer().render(data)
#        kwargs['content_type'] = 'application/json'
#        super(JSONResponse, self).__init__(content, **kwargs)
