#-*-coding:utf-8-*-

from __future__ import unicode_literals
from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class ProfileModel(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    userType = models.CharField(max_length=20, blank=True)  # extend the user,such as "teacher", "labatoryManger","administrator"
    lab = models.CharField(max_length=20, blank=True)      # if userType is "labatoryManger",this field means which lab the labatory manage

    def __unicode__(self):
        return "%s's profile" % self.user

    @receiver(post_save, sender=User)
    def create_user_profile(sender, instance, created, **kwargs):
        if created:
            ProfileModel.objects.create(user=instance)

    @receiver(post_save, sender=User)
    def save_user_profile(sender, instance, **kwargs):
        instance.profilemodel.save()

class WeekModel(models.Model):
    name = models.CharField(max_length=20)
    nickName = models.IntegerField()

    def __unicode__(self):
        return "%s------%s" % (self.name, self.nickName)


class TermWeekModel(models.Model):
    name = models.CharField(max_length=20)
    nickName = models.IntegerField()

    def __unicode__(self):
        return "%s------%s" % (self.name, self.nickName)


class LessonModel(models.Model):
    name = models.CharField(max_length=20)
    nickName = models.IntegerField()

    def __unicode__(self):
        return "%s------%s" % (self.name, self.nickName)

class LabModel(models.Model):
    name = models.CharField(max_length=20)
    nickName = models.IntegerField()

    def __unicode__(self):
        return "%s------%s" % (self.name, self.nickName)

class RoomModel(models.Model):
    name = models.CharField(max_length=20)
    lab = models.ForeignKey(LabModel)
    nickName = models.IntegerField()

    def __unicode__(self):
        return "%s------%s" % (self.name, self.nickName)


class CourseTypeModel(models.Model):
    name = models.CharField(max_length=20)
    nickName = models.IntegerField()

    def __unicode__(self):
        return "%s------%s" % (self.name, self.nickName)


class CourseModel(models.Model):
    user = models.ForeignKey(User)
    courseName = models.CharField(max_length=40)
    lab = models.ForeignKey(LabModel,blank=True, null=True)  #该课程属于那个实验室
    theoryClass = models.CharField(max_length=40)
    teacher = models.CharField(max_length=60)
    studentGrade = models.CharField(max_length=40)
    studentSubject = models.CharField(max_length=40)
    studentNumber = models.IntegerField()

    courseType = models.ForeignKey(CourseTypeModel)
    needAssistant = models.BooleanField(default=True)
    extra = models.TextField(blank=True)

    experimentTotalCourePeriod = models.IntegerField(default=0, blank=True)
    experimentTotalCourseCount = models.IntegerField(default=0, blank=True)

    # exp type special information end
    def __unicode__(self):
        return self.courseName

class AssistantModel(models.Model):
    name = models.CharField(max_length=30)
    phone = models.CharField(max_length=20)
    lab = models.ForeignKey(LabModel)
    def __unicode__(self):
        return "%s------%s" % (self.name, self.phone)

class ArrangementModel(models.Model):
    courseName = models.ForeignKey(CourseModel)
    termWeek = models.ForeignKey(TermWeekModel)
    week = models.ForeignKey(WeekModel)
    lesson = models.ForeignKey(LessonModel)
    name = models.CharField(max_length=80, blank=True)
    location = models.ForeignKey(RoomModel,blank=True, null=True)
    assistant = models.ForeignKey(AssistantModel, blank=True, null=True)

    def __unicode__(self):
        return self.exp_name




class SystemSettingModel(models.Model):
    key = models.CharField(max_length=50)
    value = models.TextField(blank=True)

    def __unicode__(self):
        return "%s----%s" % (self.key, self.value)

