from django.conf import settings
from django.urls import path, include
from rest_framework.routers import DefaultRouter, SimpleRouter

from contacts.api.views import ContactViewSet


if settings.DEBUG:
    router = DefaultRouter()
else:
    router = SimpleRouter()

router.register(r"contacts", ContactViewSet, basename='contacts')

app_name = 'api'
urlpatterns = [
    path('', include(router.urls)),

]
