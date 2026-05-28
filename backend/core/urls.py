from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    # Fixed the typo here from admin.site.split to admin.site.urls
    path('admin/', admin.site.urls),
    path('api/', include('ingestion.urls')),
]