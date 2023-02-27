from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication


from .serializers import PurchaseSerializer
from purchases.models import Purchase
from purchases.api.permissions import IsOwnerOrAdmin


class PurchaseViewset(ModelViewSet):
    serializer_class = PurchaseSerializer
    queryset = Purchase.objects.all()
    authentication_classes = [JWTAuthentication,
                              TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin,]
    lookup_field = 'id'

    def perform_create(self, serializer):
        serializer.save(buyer=self.request.user.id)

    def get_queryset(self):
        return self.queryset.filter(buyer=self.request.user.id)


class UserAsSellerViewSet(ModelViewSet):
    queryset = Purchase.objects.all()
    serializer_class = PurchaseSerializer
    authentication_classes = [JWTAuthentication,
                              TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]

    def get_queryset(self):
        return self.queryset.filter(seller=self.request.user.id)

    """   def pre_save(self, obj):
        obj.sellers = self.request.user

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        user = self.request.user

        v = Purchase.objects.filter(sellers=user)

        sells = Purchase.objects.filter(sellers=user).values('id', 'purchases', 'buyer', 'buyer_username', 'sellers', 'purchases_price',
                                                             'created', 'purchased_item_name', 'purchased_item_description', 'purchased_item_product_image', 'on_stock')
        return Response(sells)
 """
