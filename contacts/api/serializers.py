from rest_framework import serializers
from contacts.models import Contact


class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = '__all__'

        extra_kwargs = {'url': {'lookup_field': 'usernameInfo'}}
