from django.contrib.auth import get_user_model
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet
from rest_framework.viewsets import ModelViewSet
from rest_framework.generics import GenericAPIView
from django.conf import settings
from django.http import JsonResponse
import requests

from .serializers import UserSerializer


UserModel = getattr(settings, 'AUTH_USER_MODEL')
User = get_user_model()
djoser_user_activate_url = getattr(settings, 'DJOSER_USER_ACTIVATE_URL')


class UserViewSet(ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAdminUser, IsAuthenticated,]
    lookup_field = "username"


class UserCountView(ListModelMixin, RetrieveModelMixin, GenericViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.filter(is_staff=False)
    authentication_classes = [TokenAuthentication,]
    permission_classes = [IsAdminUser, IsAuthenticated,]

    def list(self, request, *args, **kwargs):
        obj = User.objects.filter(is_staff=False).count()

        content = {"active_users": obj}
        return Response(content)


class ActivateUser(GenericAPIView):

    def get(self, request, uid, token, format=None):
        payload = {'uid': uid, 'token': token}

        url = djoser_user_activate_url
        response = requests.post(url, data=payload)

        if response.status_code == 204:
            return Response({}, response.status_code)
        else:
            return Response(response.json())


class UserRedirectSocial(GenericAPIView):

    def get(self, request, *args, **kwargs):
        code, state = str(request.GET['code']), str(request.GET['state'])
        json_obj = {'code': code, 'state': state}
        print(json_obj)
        return JsonResponse(json_obj)
