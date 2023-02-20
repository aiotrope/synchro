from rest_framework.viewsets import ModelViewSet
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from .serializers import InitialSerializer
from initial.models import Initial


class InitialViewset(ModelViewSet):
    serializer_class = InitialSerializer
    queryset = Initial.objects.all()
    authentication_classes = [JWTAuthentication,
                              TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAdminUser, IsAuthenticated]
