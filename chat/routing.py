# chat/routing.py
from django.urls import path

from .consumer import ChatConsumer

websocket_urlpatterns = [
    path('ws/chat/<str:room_name>/', ChatConsumer),
]
