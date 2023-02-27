from rest_framework import serializers

from purchases.models import Purchase


class PurchaseSerializer(serializers.ModelSerializer):

    class Meta:
        model = Purchase
        fields = '__all__'
        extra_kwargs = {'url': {'lookup_field': 'id'}}
