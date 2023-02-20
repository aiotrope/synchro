from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin, UpdateModelMixin
from rest_framework import filters
from django.contrib.auth import get_user_model

from .serializers import ItemSerializer
from items.models import Item
from .permissions import IsVendorOrReadOnly

User = get_user_model()


class ItemViewset(ModelViewSet):
    serializer_class = ItemSerializer
    queryset = Item.objects.all().order_by('-created')
    authentication_classes = [JWTAuthentication,
                              TokenAuthentication, SessionAuthentication]
    lookup_field = 'slug'
    permission_classes = [IsAuthenticated, IsVendorOrReadOnly,]
    search_fields = ['name',]
    filter_backends = (filters.SearchFilter,)

    def perform_create(self, serializer):
        serializer.save(merchant=self.request.user)


class ItemCountView(ListModelMixin, RetrieveModelMixin, GenericViewSet):
    serializer_class = ItemSerializer
    queryset = Item.objects.all()
    authentication_classes = [JWTAuthentication,
                              TokenAuthentication, SessionAuthentication,]
    permission_classes = [IsAdminUser, IsAuthenticated,]

    def list(self, request, *args, **kwargs):
        product_count = Item.objects.all().count()
        content = {'item_count': product_count}
        return Response(content)


class ItemFabricatedCountView(ListModelMixin, RetrieveModelMixin, GenericViewSet):
    serializer_class = ItemSerializer
    fabUsers = User.objects.filter(fabricated=True)
    queryset = Item.objects.filter(merchant=fabUsers)
    authentication_classes = [JWTAuthentication,
                              TokenAuthentication, SessionAuthentication,]
    permission_classes = [IsAdminUser, IsAuthenticated,]

    def list(self, request, *args, **kwargs):
        fabUsers = User.objects.filter(fabricated=True)
        product_count = Item.objects.filter(merchant=fabUsers).count()
        content = {'item_count': product_count}
        return Response(content)


class ItemUnFabricatedCountView(ListModelMixin, RetrieveModelMixin, GenericViewSet):
    serializer_class = ItemSerializer
    users = User.objects.filter(fabricated=False)
    queryset = Item.objects.all()
    authentication_classes = [JWTAuthentication,
                              TokenAuthentication, SessionAuthentication,]
    permission_classes = [IsAdminUser, IsAuthenticated,]

    def list(self, request, *args, **kwargs):
        users = User.objects.filter(fabricated=False)
        product_count = Item.objects.all(merchant=users).count()
        content = {'item_count': product_count}
        return Response(content)

class ItemOwnedByUserView(RetrieveModelMixin, UpdateModelMixin, GenericViewSet):
    serializer_class = ItemSerializer
    queryset = Item.objects.all()
    authentication_classes = [JWTAuthentication, TokenAuthentication,
                              SessionAuthentication,]
    permission_classes = [IsVendorOrReadOnly, IsAuthenticated,]
    lookup_field = 'slug'

    def list(self, request, *args, **kwargs):
        user = self.request.user

        product_owned_by_user = Item.objects.filter(merchant=user).values(
            'id', 'name', 'slug', 'description', 'price', 'item_image', 'created', 'updated', 'merchant',)
        return Response(product_owned_by_user)
