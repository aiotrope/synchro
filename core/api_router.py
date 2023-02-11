from django.conf import settings
from django.urls import path, include
from rest_framework.routers import DefaultRouter, SimpleRouter

from users.api.views import UserViewSet, UserCountView, UserRetrieveDestroy


if settings.DEBUG:
    router = DefaultRouter()
else:
    router = SimpleRouter()

# router.register(r"users", UserViewSet, basename='users')
# router.register(r"user-counts", UserCountView, basename='user-counts')
# router.register(r"user-retrieve", UserRetrieveDestroy, basename='user-retrieve-destroy')

app_name = 'api'
urlpatterns = [
    path('', include(router.urls)),

]
