from django.contrib.auth import get_user_model
from rest_framework import serializers


User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'fabricated', 'first_name', 'last_name', 'last_login', 'is_staff', 'is_superuser', 'date_joined', 'is_active',]

        extra_kwargs = {'url': {'lookup_field': 'username'}}
