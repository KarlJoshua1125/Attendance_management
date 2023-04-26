from django.urls import path
from . import views
urlpatterns = [
    path('', views.index, name = 'index'),
    path('add_student', views.add_student, name = 'add_student'),
    path('update_student/', views.update_student, name='update_student'),
    path('deletestudent/<int:id>', views.deletestudent, name = 'deletestudent'),
]