from django.contrib import admin
from EXPS.models import TermWeekModel, WeekModel, LessonModel, LabModel, RoomModel, ProfileModel,\
    CourseTypeModel, CourseModel, ArrangementModel, SystemSettingModel, AssistantModel
# Register your models here.
admin.site.register(TermWeekModel)
admin.site.register(WeekModel)
admin.site.register(LessonModel)
admin.site.register(LabModel)
admin.site.register(RoomModel)
admin.site.register(ProfileModel)
admin.site.register(CourseTypeModel)
admin.site.register(CourseModel)
admin.site.register(ArrangementModel)
admin.site.register(SystemSettingModel)
admin.site.register(AssistantModel)