from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.db.models import Sum, Count

from .serializers import CartSerializer
from carts.models import Cart
from .permissions import IsOwnerOrAdmin


class CartViewset(ModelViewSet):
    serializer_class = CartSerializer
    queryset = Cart.objects.all()
    authentication_classes = [JWTAuthentication,
                              TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]
    lookup_field = 'id'

    def perform_create(self, serializer):
        serializer.save(customer_email=self.request.user.email)

    def get_queryset(self):
        return self.queryset.filter(customer=self.request.user)

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        user = self.request.user
        costObj = list(Cart.objects.filter(customer=user).aggregate(
            Sum('item_price_entry')).values())[0]

        response.data['bill'] = costObj
        response.data['number_of_items'] = list(Cart.objects.filter(
            customer=user).aggregate(Count('item')).values())[0]
        return response
