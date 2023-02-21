from rest_framework import serializers
from initial.models import Initial


class InitialSerializer(serializers.ModelSerializer):

    class Meta:
        model = Initial
        fields = ['pk', 'name', 'created',]