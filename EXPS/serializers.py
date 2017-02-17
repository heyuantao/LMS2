#-*-coding:utf-8-*-

from rest_framework import serializers
from EXPS.models import TermWeekModel, WeekModel, LessonModel, LabModel, RoomModel, CourseTypeModel, AssistantModel, \
    CourseModel, AssistantModel

class TermWeekModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = TermWeekModel
        fields = ('id', 'name', 'nickName')

class WeekModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeekModel
        fields = ('id', 'name', 'nickName')

class LessonModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonModel
        fields = ('id', 'name', 'nickName')

class LabModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabModel
        fields = ('id', 'name', 'nickName')
        read_only_fields = ('id',)

class CourseTypeModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseTypeModel
        fields = ('id', 'name', 'nickName')

#class AssistantModelSerializer(serializers.ModelSerializer):
#    class Meta:
#        model = AssistantModel
#        fields = ('id', 'name', 'phone', 'lab')
#        depth = 1

class RoomModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomModel
        fields = ('id', 'name', 'lab', 'nickName')
        depth = 1

#这个序列化工具只在显示课程信息的时候用到，写入的时候有单独的代码
#class CourseModelSerializer(serializers.Serializer):
#    id = serializers.IntegerField()
#    user =serializers.CharField(max_length=200)
#    experimentName =serializers.CharField(max_length=200) #courseName
#    theoryClass =serializers.CharField(max_length=200) #theoryClass
#    teacher =serializers.CharField(max_length=200) #teacher
#    studentGrade =serializers.IntegerField() #studentGrade
#    studentSubject =serializers.CharField(max_length=200) #studentSubject
#    studentNumber =serializers.IntegerField() #studentNumber
#    courseType =serializers.CharField(max_length=200) #courseType
#    needAssistant =serializers.CharField(max_length=200) #needAssistant
#    extra =serializers.CharField(max_length=200) #extra
#    experimentTotalCourePeriod =serializers.IntegerField() #experimentTotalCourePeriod
#    experimentTotalCourseCount =serializers.IntegerField() #experimentTotalCourseCount


#    def create(self, validated_data):
#        print validated_data
        #return CourseModel(**validated_data)


#这个序列化和反序列化自己操作
#class AssistantModelSerializer(serializers.Serializer):
#    class Meta:
#        model = AssistantModel
#        fields = ('id', 'courseName', 'termWeek', 'week', 'lesson', 'name',\
#                  'location', 'assistant', )
#        depth = 1