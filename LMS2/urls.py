#-*-coding:utf-8-*-
"""LMS2 URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.10/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.views.decorators.csrf import csrf_exempt

###
from EXPS.views import LoginView, LogoutView, RegisterView
from EXPS.views import TermWeekListView, WeekListView, LessonListView, LabListView, CourseTypeListView, AssistantListView,\
    UserStateView, RoomListView, LabDetailView, RoomDetailView, AssistantDetailView
from EXPS.views import CourseListView
from EXPS.views import CourseDetailView,ArrangementsListView
from EXPS.views import SystemSettingsView
from EXPS.views import RoomUseageView,AssistantArrangementView,UnDisposedItemsView #数据视图
###
urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^login/', LoginView.as_view()),
    url(r'^logout/', LogoutView.as_view()),
    url(r'^register/', RegisterView.as_view()),
    url(r'^userstate/', UserStateView.as_view()),
    url(r'^api/termweeklist/', TermWeekListView.as_view()),
    url(r'^api/weeklist/', WeekListView.as_view()),
    url(r'^api/lessonlist/', LessonListView.as_view()),
    url(r'^api/lablist/', LabListView.as_view()),
    url(r'^api/labdetail/(?P<id>[0-9]+)/$', LabDetailView.as_view()),
    url(r'^api/coursetypelist/', CourseTypeListView.as_view()),
    url(r'^api/assistantlist/', AssistantListView.as_view()),
    url(r'^api/assistantdetail/(?P<id>[0-9]+)/$', AssistantDetailView.as_view()),
    url(r'^api/roomlist/', RoomListView.as_view()),
    url(r'^api/roomdetail/(?P<id>[0-9]+)/$', RoomDetailView.as_view()),
    url(r'^api/courselist/', CourseListView.as_view()),
    url(r'^api/coursedetails/(?P<id>[0-9]+)/$', CourseDetailView.as_view()),
    url(r'^api/arrangementlist/', ArrangementsListView.as_view()),
    url(r'^api/systemsettings/', SystemSettingsView.as_view()),
    ##数据视图接口
    url(r'^api/assistantarrangement/', AssistantArrangementView.as_view()),
    url(r'^api/roomusage/', RoomUseageView.as_view()),
    url(r'^api/undisposeditems/(?P<type>\w+)/$', UnDisposedItemsView.as_view()),
    #type in "weeklistofemptyassistantonarrangement","courselisthasemptylocation"
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
