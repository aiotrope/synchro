from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework import generics, status
from rest_framework import views
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from dj_rest_auth.registration.views import SocialLoginView
from allauth.socialaccount.providers.facebook.views import FacebookOAuth2Adapter
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet
from rest_framework.viewsets import ModelViewSet
from rest_framework.generics import GenericAPIView
from django.views.generic.base import TemplateView
from social_core.backends import google, facebook

import requests

from .serializers import UserSerializer


UserModel = getattr(settings, 'AUTH_USER_MODEL')
User = get_user_model()
djoser_user_activate_url = getattr(settings, 'DJOSER_USER_ACTIVATE_URL')


class UsersList(generics.ListAPIView):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    authentication_classes = [JWTAuthentication,
                              TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request, *args, **kwargs):
        users = User.objects.all()
        serializer = UserSerializer(
            users, many=True, context={'request': request})

        return Response(serializer.data, status=status.HTTP_200_OK)


class UserRetrieveDestroy(generics.RetrieveDestroyAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication,
                              TokenAuthentication, SessionAuthentication]
    serializer_class = UserSerializer
    lookup_field = 'username'

    def get_queryset(self):
        user = self.request.user.username
        return User.objects.filter(username=user)

    def delete(self, request, *args, **kwargs):
        user = self.get_queryset()
        if user:
            user.delete()
            return Response({'message': 'Account deleted!'}, status=status.HTTP_204_NO_CONTENT)
        return Response({'message': 'Account not deleted'}, status=status.HTTP_400_BAD_REQUEST)


class UserViewSet(ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    authentication_classes = [JWTAuthentication,
                              TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated,]
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
    # REDIRECT_STATE = False


class CustomFacebookOAuth2(facebook.FacebookOAuth2):
    STATE_PARAMETER = False
    # REDIRECT_STATE = False


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


class FacebookLogin(SocialLoginView):
    adapter_class = FacebookOAuth2Adapter


class UserRedirectSocialGoogle(views.APIView):

    def get(self, request, code):
        post_data = {'code': code}
        return Response(post_data)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        print(context)
        return context


class UserRedirectSocialFacebook(views.APIView):

    def get(self, request, code):
        post_data = {'code': code}
        return Response(post_data)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        print(context)
        return context


