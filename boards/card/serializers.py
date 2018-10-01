from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Card


class CardSerializer(serializers.ModelSerializer):

        class Meta:
            model = Card
            fields = ('id', 'title', 'description', 'assigned_to', 'due_date', 'owner')