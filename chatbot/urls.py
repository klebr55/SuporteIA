from django.urls import path
from . import views

urlpatterns = [
    path('', views.index_view, name='index_view'),
    path('api/chat/', views.chat_api, name='chat_api'),
    path('api/login/', views.api_login, name='api_login'),
    path('dashboard/', views.dashboard_view, name='dashboard_view'),
    path('chat/', views.chat_page, name='chat_page'),
]
