from django.urls import path
from .views import (
    register_view, login_view, user_status_view, logout_view, profile_view, admin_users_view,
    course_videos_view, video_progress_view, admin_videos_view, add_badge_view, search_profile_view
)

urlpatterns = [
    path('register/', register_view, name='register'),
    path('login/', login_view, name='login'),
    path('user/', user_status_view, name='user_status'),
    path('logout/', logout_view, name='logout'),
    path('profile/', profile_view, name='profile'),
    path('profile/badges/', add_badge_view, name='add_badge'),
    path('profile/search/', search_profile_view, name='search_profile'),
    path('admin/users/', admin_users_view, name='admin_users'),
    path('courses/videos/', course_videos_view, name='course_videos'),
    path('courses/videos/progress/', video_progress_view, name='video_progress'),
    path('admin/videos/', admin_videos_view, name='admin_videos'),
]



