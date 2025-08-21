from django.contrib import admin
from django.urls import path, include
from api.views import CreateUserView,LogoutView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static


admin.site.site_header = "Blog Admin"
admin.site.site_title  = "Blog Admin Portal"
admin.site.index_title = "Welcome to Blog Admin Portal"


urlpatterns = [
    path("admin/", admin.site.urls),
    # jwt token urls
    path("api/token/", TokenObtainPairView.as_view(), name="get_token"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh"),

    # user authentication urls
    path("api/user/register/", CreateUserView.as_view(), name="register"),
    path("api-auth/", include("rest_framework.urls")),
    path("api/user/logout/", LogoutView.as_view(), name="logout"),

    # api urls
    path("api/", include("api.urls")),
    
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)