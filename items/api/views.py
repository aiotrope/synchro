from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin, UpdateModelMixin
from rest_framework import filters, status
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
    permission_classes = [IsVendorOrReadOnly,]
    search_fields = ['name',]
    filter_backends = (filters.SearchFilter,)

    def get_serializer(self, *args, **kwargs):
        serializer_class = self.get_serializer_class()
        kwargs.setdefault('context', self.get_serializer_context())
        return serializer_class(*args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(merchant=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data, many=isinstance(request.data, list))
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class ItemCountView(ListModelMixin, RetrieveModelMixin, GenericViewSet):
    serializer_class = ItemSerializer
    queryset = Item.objects.all()
    authentication_classes = [JWTAuthentication,
                              TokenAuthentication, SessionAuthentication,]
    permission_classes = [IsVendorOrReadOnly,]

    def list(self, request, *args, **kwargs):
        
        product_count = self.queryset.count()
        content = {'item_count': product_count}
        return Response(content)


class ItemFabricatedCountView(ListModelMixin, RetrieveModelMixin, GenericViewSet):
    serializer_class = ItemSerializer
    queryset = Item.objects.all()
    authentication_classes = [JWTAuthentication,
                              TokenAuthentication, SessionAuthentication,]
    permission_classes = [IsAdminUser, IsAuthenticated,]

    def list(self, request, *args, **kwargs):
        product_count = self.queryset.filter(merchant__fabricated=True).count()
        content = {'item_count': product_count}
        return Response(content)


class ItemUnFabricatedCountView(ListModelMixin, RetrieveModelMixin, GenericViewSet):
    serializer_class = ItemSerializer

    queryset = Item.objects.all()
    authentication_classes = [JWTAuthentication,
                              TokenAuthentication, SessionAuthentication,]
    permission_classes = [IsAdminUser, IsAuthenticated,]

    def list(self, request, *args, **kwargs):
        product_count = self.queryset.filter(merchant__fabricated=False).count()
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
