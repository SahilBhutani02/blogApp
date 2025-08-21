from django.contrib.auth.models import User
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import Blog


class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    username = serializers.CharField(required=True)
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ["id", "username", "email", "password"]

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value
    
    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("This username is already taken.")
        return value

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email"]        


class BlogSerializer(serializers.ModelSerializer):
    tags = serializers.ListField(child=serializers.CharField())
    thumbnail = serializers.ImageField(required=False)
    author = AuthorSerializer(read_only=True) 
    
    print(tags)
    class Meta:
        model = Blog
        fields = [
            "id",
            "title",
            "subtitle",
            "description",
            "category",
            "tags",
            "thumbnail",
            "created_at",
            "author",
        ]
        read_only_fields = ["id", "created_at", "author"]
  

    def create(self, validated_data):
        request = self.context.get("request")
        user = request.user if request else None
        return Blog.objects.create(author=user, **validated_data)