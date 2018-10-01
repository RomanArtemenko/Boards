from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Card, Status

User = get_user_model()


class UserLiteSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name')


class StatusSerializer(serializers.ModelSerializer):

    class Meta:
        model = Status
        fields = ('id', 'name')


class CardSerializer(serializers.ModelSerializer):
    assigned_to = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    assigned_to_repr = UserLiteSerializer(source='assigned_to', read_only=True)
    owner = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    owner_repr = UserLiteSerializer(source='owner', read_only=True)
    status = serializers.PrimaryKeyRelatedField(queryset=Status.objects.all())
    status_repr = StatusSerializer(source='status', read_only=True)

    class Meta:
            model = Card
            fields = ('id', 'title', 'description', 'assigned_to', 'assigned_to_repr', 'due_date', 'owner', 'owner_repr', 'status', 'status_repr')