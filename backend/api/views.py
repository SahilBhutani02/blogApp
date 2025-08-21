from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from django.db.models import Q
import os
import google.generativeai as genai

from .serializers import UserSerializer, BlogSerializer
from .models import Blog


# AI integration 
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)


# Generate description with AI
class GenerateDescriptionView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        title = request.data.get('title', '')

        if not title:
            return Response({'error': 'Title is required'}, status=400)

        prompt = f"Write a detailed blog post on '{title}'."

        try:
              # Use Gemini Pro model
            model = genai.GenerativeModel("gemini-1.5-flash")
            response = model.generate_content(prompt)

            return Response({"data": response.text})

        except Exception as e:
            return Response({"error": str(e)}, status=500)
        


# Generate Seo Tags with AI
class GenerateSeoTagsView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        title = request.data.get('title', '')
        if not title:
            return Response({'error': 'Title is required'}, status=400)

        prompt = f"Generate 4-5 short SEO tags (comma-separated) for the topic: {title}"

        try:
            # Use a fast Gemini model
            model = genai.GenerativeModel("gemini-1.5-flash")
            response = model.generate_content(prompt)

            # Convert to Python list
            tags_text = response.text.strip()
            tags = [tag.strip() for tag in tags_text.split(',') if tag.strip()]

            return Response({"data": tags})

        except Exception as e:
            return Response({"error": str(e)}, status=500)



# List all blogs
class BlogListView(generics.ListAPIView):
    queryset = Blog.objects.all().order_by('-created_at')
    serializer_class = BlogSerializer
    permission_classes = [AllowAny]


# List of user blogs
class UserBlogListView(generics.ListAPIView):
    serializer_class = BlogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Blog.objects.filter(author=self.request.user)    


# Create a blog 
class BlogCreateView(generics.CreateAPIView):
    serializer_class = BlogSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save()


# Update a blog
class BlogUpdateView(generics.UpdateAPIView):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer
    permission_classes = [IsAuthenticated]
    
    def update(self, request, *args, **kwargs):
        kwargs['partial'] = True  
        return super().update(request, *args, **kwargs)


# Delete a blog
class BlogDeleteView(generics.DestroyAPIView):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer
    permission_classes = [IsAuthenticated]
   
    def get_queryset(self):
        user = self.request.user
        return Blog.objects.filter(author=user)


# Search blog by title, subtitle, category
class BlogSearchView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = BlogSerializer

    def get_queryset(self):
    
        query = self.request.query_params.get("q", "").strip()
        
        if not query:
            return Response({"error": "Query parameter 'q' is required"}, status=400)

        return Blog.objects.filter(
            Q(title__icontains=query) |
            Q(subtitle__icontains=query) |
            Q(category__icontains=query)
        ).distinct()



# user authentication
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"detail": "Logged out successfully"}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)