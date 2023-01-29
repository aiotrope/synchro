from django.contrib.auth import get_user_model
from rest_framework import serializers
from django.conf import settings

UserModel = getattr(settings, 'AUTH_USER_MODEL')
User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

        extra_kwargs = {
            "url": {"view_name": "api:user-detail", "lookup_field": "username"}
        }
