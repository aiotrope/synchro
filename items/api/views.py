from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin
from rest_framework import filters, status
from django.contrib.auth import get_user_model

from .serializers import ItemSerializer
from items.models import Item
from .permissions import IsVendorOrReadOnly, IsAdminOrReadOnly

User = get_user_model()


class ItemViewset(ModelViewSet):
    serializer_class = ItemSerializer
    queryset = Item.objects.all().order_by('name')
    authentication_classes = [JWTAuthentication,
                              TokenAuthentication, SessionAuthentication]
    lookup_field = 'id'
    permission_classes = [IsVendorOrReadOnly,]
    # filterset_fields = ['name',]
    search_fields = ['name',]
    # ordering_fields = ['created', 'updated']
    filter_backends = [filters.SearchFilter,]

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
    permission_classes = [IsAdminOrReadOnly,]

    def list(self, request, *args, **kwargs):

        product_count = self.queryset.count()
        content = {'item_count': product_count}
        return Response(content)


class ItemFabricatedCountView(ListModelMixin, RetrieveModelMixin, GenericViewSet):
    serializer_class = ItemSerializer
    queryset = Item.objects.all()
    authentication_classes = [JWTAuthentication,
                              TokenAuthentication, SessionAuthentication,]
    permission_classes = [IsAdminOrReadOnly,]

    def list(self, request, *args, **kwargs):
        product_count = self.queryset.filter(merchant__fabricated=True).count()
        content = {'item_count': product_count}
        return Response(content)


class ItemUnFabricatedCountView(ListModelMixin, RetrieveModelMixin, GenericViewSet):
    serializer_class = ItemSerializer

    queryset = Item.objects.all()
    authentication_classes = [JWTAuthentication,
                              TokenAuthentication, SessionAuthentication,]
    permission_classes = [IsAdminOrReadOnly,]

    def list(self, request, *args, **kwargs):
        product_count = self.queryset.filter(
            merchant__fabricated=False).count()
        content = {'item_count': product_count}
        return Response(content)


class ItemOwnedByUserView(ModelViewSet):
    serializer_class = ItemSerializer
    queryset = Item.objects.all()
    authentication_classes = [JWTAuthentication, TokenAuthentication,
                              SessionAuthentication,]
    permission_classes = [IsVendorOrReadOnly, IsAuthenticated,]
    lookup_field = 'id'

    def get_queryset(self):
        items = Item.objects.filter(merchant=self.request.user.id)
        return items

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(
            instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):

            instance._prefetched_objects_cache = {}

        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
