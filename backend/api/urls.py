from django.urls import path
from . import views

urlpatterns = [
    path("blogs", views.BlogListView.as_view(), name="blogs-list"),
    path("your-blogs", views.UserBlogListView.as_view(), name="your-blogs"),
    path("write-blog", views.BlogCreateView.as_view(), name="create-blog"),
    path("write-blog/<int:pk>", views.BlogUpdateView.as_view(), name="update-blog"),
    path("delete-blog/<int:pk>", views.BlogDeleteView.as_view(), name="delete-blog"),
    path("search-blog", views.BlogSearchView.as_view(), name="search-blog"),
    path('generate-description', views.GenerateDescriptionView.as_view(), name="generate-description"),
    path('generate-seo-tags', views.GenerateSeoTagsView.as_view(), name="generate-seo-tags"),
]

