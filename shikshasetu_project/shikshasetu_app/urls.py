from django.urls import path
from .views import register_view, login_view, user_status_view, logout_view, profile_view

urlpatterns = [
    path('register/', register_view, name='register'),
    path('login/', login_view, name='login'),
    path('user/', user_status_view, name='user_status'),
    path('logout/', logout_view, name='logout'),
    path('profile/', profile_view, name='profile'),
]
