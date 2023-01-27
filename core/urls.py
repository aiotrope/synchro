from django.contrib import admin
from django.urls import path, include
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path('admin/', admin.site.urls),
    # API base URL
    path('api/', include('core.api_router')),
    # DRF auth token
    path('auth-token/', obtain_auth_token),
    # Login via browsable API
    path('api-auth/', include('rest_framework.urls')),
    # Login via Rest
    path('dj-rest-auth/', include('dj_rest_auth.urls')),
    # Signup via Rest
    path('dj-rest-auth/registration/', include('dj_rest_auth.registration.urls')),
]
