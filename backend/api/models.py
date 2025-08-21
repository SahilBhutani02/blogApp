from django.db import models
from django.contrib.auth.models import User


class Blog(models.Model):
    title = models.CharField(max_length=100)
    subtitle = models.CharField(max_length=100)
    description = models.TextField()
    category = models.CharField(max_length=100)
    tags = models.JSONField() 
    thumbnail = models.ImageField(upload_to="thumbnails/")
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="blogs")

    def __str__(self):
        return self.title     
    