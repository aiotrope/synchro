from rest_framework import serializers
from items.models import Item


class ItemSerializer(serializers.ModelSerializer):
    created = serializers.SerializerMethodField()
    updated = serializers.SerializerMethodField()
    merchant_email = serializers.SerializerMethodField()
    merchant_username = serializers.SerializerMethodField()

    class Meta:
        model = Item
        fields = ['id', 'name', 'slug', 'description', 'price', 'merchant', 'created',
                  'updated', 'item_image', 'merchant_email', 'merchant_username', 'on_stock', 'currency', 'price_entry']
        read_only_fields = ('on_stock',)
        extra_kwargs = {'url': {'lookup_field': 'slug'}}

    def get_created(self, instance):
        return instance.created.strftime('%B %d %Y')

    def get_updated(self, instance):
        return instance.updated.strftime('%B %d %Y')

    def get_merchant_email(self, instance):
        return instance.merchant.email

    def get_merchant_username(self, instance):
        return instance.merchant.username
