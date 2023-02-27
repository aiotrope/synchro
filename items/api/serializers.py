from rest_framework import serializers
from babel.numbers import format_decimal

from items.models import Item


class ItemSerializer(serializers.ModelSerializer):
    created = serializers.SerializerMethodField()
    updated = serializers.SerializerMethodField()
    merchant_email = serializers.SerializerMethodField()
    merchant_username = serializers.SerializerMethodField()
    price = serializers.SerializerMethodField()

    class Meta:
        model = Item
        fields = ['id', 'name', 'description', 'price', 'merchant', 'created',
                  'updated', 'item_image', 'merchant_email', 'merchant_username', 'on_stock', 'price_entry',]
        read_only_fields = ('on_stock',)
        extra_kwargs = {'url': {'lookup_field': 'id'}}

    def get_created(self, instance):
        return instance.created.strftime('%B %d %Y')

    def get_updated(self, instance):
        return instance.updated.strftime('%B %d %Y')

    def get_merchant_email(self, instance):
        return instance.merchant.email

    def get_merchant_username(self, instance):
        return instance.merchant.username

    def get_price(self, instance):
        formatted = format_decimal(instance.price_entry, locale='de_DE')
        return formatted
