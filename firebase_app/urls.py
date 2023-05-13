from django.urls import path
from . import views
from django.contrib import admin
from django.urls import path


urlpatterns = [
    path('index/', views.index, name = 'index'),
    path('', views.homepage, name='homepage'),
    path('update_student/', views.update_student, name='update_student'),
    path('deletestudent/<int:id>', views.deletestudent, name = 'deletestudent'),
    path('attendance/', views.attendance, name='attendance'),
    path('sections/', views.sections, name='sections'),
    path('update_attendance/', views.update_attendance, name='update_attendance'),



]