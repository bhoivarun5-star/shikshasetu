from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    mobile_number = models.CharField(max_length=15, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    skills = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.user.email or self.user.username


class CourseVideo(models.Model):
    title = models.CharField(max_length=200)
    category = models.CharField(max_length=100)
    video_url = models.URLField()
    thumbnail_url = models.URLField(blank=True, null=True)
    duration = models.CharField(max_length=20, default="00:00")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class VideoProgress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='video_progress')
    video = models.ForeignKey(CourseVideo, on_delete=models.CASCADE, related_name='progress')
    last_position = models.FloatField(default=0.0)
    percentage = models.IntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'video')

    def __str__(self):
        return f"{self.user.email or self.user.username} - {self.video.title} ({self.percentage}%)"

