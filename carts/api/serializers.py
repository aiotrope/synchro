from rest_framework import serializers
from babel.numbers import format_decimal

from carts.models import Cart


class CartSerializer(serializers.ModelSerializer):
    item_name = serializers.SerializerMethodField()
    item_price_entry = serializers.SerializerMethodField()
    item_price = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = '__all__'
        extra_kwargs = {'url': {'lookup_field': 'id'}}

    def get_item_name(self, instance):
        return instance.item.name

    def get_item_price_entry(self, instance):
        return instance.item.price_entry

    def get_item_price(self, instance):
        item_price = format_decimal(instance.item_price_entry, locale='de_DE')
        return item_price
