from django.urls import path
from .views import index,realtime,summary

app_name = 'chat'
urlpatterns = [
    
    path('', index, name='index'),
    path('summary/<str:room_name>/', summary, name='summary'),
    #views.py - room_name tu parameter yg kne pass
    path('<str:room_name>/', realtime, name='realtime'),
]

