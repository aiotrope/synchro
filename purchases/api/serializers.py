from rest_framework import serializers
from django.contrib.auth import get_user_model

from purchases.models import Purchase
from items.models import Item

User = get_user_model()


class PurchaseSerializer(serializers.ModelSerializer):
    purchased_item_name = serializers.SerializerMethodField()
    purchased_item_id = serializers.SerializerMethodField()
    purchased_item_image = serializers.SerializerMethodField()
    buyer_email = serializers.StringRelatedField()
    seller_email = serializers.SerializerMethodField()
    price_entry = serializers.SerializerMethodField()
    buyer_email = serializers.SerializerMethodField()
    on_stock = serializers.SerializerMethodField()
    price_entry = serializers.SerializerMethodField()
    created = serializers.SerializerMethodField()

    class Meta:
        model = Purchase
        fields = '__all__'
        extra_kwargs = {'url': {'lookup_field': 'id'}}

    def get_purchased_item_name(self, instance):
        return instance.purchases.item.name

    def get_purchased_item_image(self, instance):
        return instance.purchases.item.item_image

    def get_purchased_item_image(self, instance):
        return instance.purchases.item.item_image

    def get_buyer_email(self, instance):
        buyer = User.objects.get(id=instance.buyer)
        return buyer.email

    def get_seller_email(self, instance):
        seller = User.objects.get(id=instance.seller)
        return seller.email

    def get_on_stock(self, instance):
        item = Item.objects.get(id=instance.purchases.item.id)
        return item.on_stock

    def get_price_entry(self, instance):
        item = Item.objects.get(id=instance.purchases.item.id)
        return item.price_entry

    def get_created(self, instance):
        item = Item.objects.get(id=instance.purchases.item.id)
        return item.created

    def get_purchased_item_id(self, instance):
        item = Item.objects.get(id=instance.purchases.item.id)
        return item.id
