from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Card, Status


class StatusSerializer(serializers.ModelSerializer):

    class Meta:
        mode = Status
        fields = ('id', 'name')


class CardSerializer(serializers.ModelSerializer):
    # owner = serializers.
    status = StatusSerializer

        class Meta:
            model = Card
            fields = ('id', 'title', 'description', 'assigned_to', 'due_date', 'owner', 'status')