from django.contrib.auth import get_user_model
from rest_framework import views
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet
from rest_framework.viewsets import ModelViewSet
from rest_framework.generics import GenericAPIView
from django.views.generic.base import TemplateView
from social_core.backends import google, facebook


from django.conf import settings
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


class CustomGoogleOAuth2(google.GoogleOAuth2):
    STATE_PARAMETER = False


class CustomFacebookOAuth2(facebook.FacebookOAuth2):
    # REDIRECT_STATE = False
    STATE_PARAMETER = False


class UserRedirectSocialClass(object):
    def __init__(self, code):
        self.code = code


class UserRedirectSocialViewGoogle(TemplateView):
    template_name = 'social/redirect_google.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        code = str(self.request.GET['code'])
        context['social_google'] = UserRedirectSocialClass(code=code)
        return context

class UserRedirectSocialViewFacebook(TemplateView):
    template_name = 'social/redirect_facebook.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        code = str(self.request.GET['code'])
        context['social_facebook'] = UserRedirectSocialClass(code=code)
        return context



class UserRedirectSocial(views.APIView):

    def get(self, request, code):
        post_data = {'code': code}
        return Response(post_data)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        print(context)
        return context
