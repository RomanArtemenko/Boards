from django.contrib.auth import get_user_model
from django.db.models.functions import Concat
from django.db.models import Value as V
from rest_framework import serializers
from .models import Card, Status, Role

User = get_user_model()


class UserLiteSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name')


class StatusSerializer(serializers.ModelSerializer):

    class Meta:
        model = Status
        fields = ('id', 'name')


class RoleSerializer(serializers.ModelSerializer):

    class Meta:
        model = Role
        fields = ('id', 'name')


class CardSerializer(serializers.ModelSerializer):
    assigned_to = UserLiteSerializer(read_only=True, allow_null=True)
    owner = UserLiteSerializer(read_only=True)
    status = StatusSerializer(read_only=True, allow_null=True)
    role = RoleSerializer(read_only=True, many=True)

    class Meta:
        model = Card
        fields = ('id', 'title', 'description', 'due_date',
                  'owner', 'status', 'role', 'created_date', 'assigned_to')


class CardCreateSerializer(serializers.ModelSerializer):
    assigned_to = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), allow_null=True)
    owner = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), allow_null=True, required=False)
    status = serializers.PrimaryKeyRelatedField(queryset=Status.objects.all(), allow_null=True, required=False)
    # assigned_to_repr = UserLiteSerializer(source='assigned_to', read_only=True)
    # owner_repr = UserLiteSerializer(source='owner', read_only=True, allow_null=True)
    # status = serializers.ChoiceField(choices=[(s.id, s.name) for s in Status.objects.all()])
    # status_repr = StatusSerializer(source='status', read_only=True, allow_null=True)
    # role = serializers.ChoiceField(choices=[(r.id, r.name) for r in Role.objects.all()])
    # role_repr = RoleSerializer(source='role', read_only=True, many=True)

    class Meta:
        model = Card
        fields = ('id', 'title', 'description', 'assigned_to', 'due_date',
                  'owner', 'status' ,'role')