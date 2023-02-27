from django.conf import settings
from django.urls import path, include
from rest_framework.routers import DefaultRouter, SimpleRouter

from users.api.views import UserCountView, UserFabricatedCountView, UserUnFabricatedCountView
from contacts.api.views import ContactViewSet
from items.api.views import ItemViewset, ItemCountView, ItemOwnedByUserView, ItemFabricatedCountView, ItemUnFabricatedCountView
from carts.api.views import CartViewset
from purchases.api.views import PurchaseViewset, UserAsSellerViewSet
from initial.api.views import InitialViewset


if settings.DEBUG:
    router = DefaultRouter()
else:
    router = SimpleRouter()

router.register(r"initial", InitialViewset, basename='initials')
router.register(r"user-counts", UserCountView, basename='user-counts')
router.register(r"user-fabricated-counts",
                UserFabricatedCountView, basename='user-counts-fabricated')
router.register(r"user-unfabricated-counts",
                UserUnFabricatedCountView, basename='user-counts-unfabricated')
router.register(r"contacts", ContactViewSet, basename='contacts')
router.register(r"items", ItemViewset, basename='items')
router.register(r"item-counts", ItemCountView, basename='item-counts')
router.register(r"item-fabricated-counts",
                ItemFabricatedCountView, basename='item-fabricated-counts')
router.register(r"item-unfabricated-counts",
                ItemUnFabricatedCountView, basename='item-unfabricated-counts')
router.register(r"item-owned", ItemOwnedByUserView, basename='item-owned')
router.register(r"carts", CartViewset, basename='carts')
router.register(r"purchases", PurchaseViewset, basename='purchases')
router.register(r"purchases-seller", UserAsSellerViewSet,
                basename='purchases-seller')


app_name = 'api'
urlpatterns = [
    path('', include(router.urls)),

]
