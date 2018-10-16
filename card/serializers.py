from django.contrib.auth import get_user_model
from django.db import ProgrammingError
from rest_framework import serializers
from .models import Card, Status, Role
from django.core.exceptions import EmptyResultSet
from django.db.utils import OperationalError

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


class ChoiceLoader():

    def __init__(self, model, fields=None, methods=None, empty_line=None):

        if fields is None:
            fields = []

        if methods is None:
            methods = []

        if len(fields+methods) != 2:
            raise ValueError('Incorect parametr count!')

        try:
            self._data = [
                [getattr(item, field) for field in fields] +
                [getattr(item, method)() for method in methods]
                for item in model.objects.all()
            ]
        except (AttributeError, EmptyResultSet, OperationalError, ProgrammingError):
            self._data = []

        if empty_line is not None:
            self._data = self._data + [[None, empty_line]]

    def get_data(self):
        return list(self._data)


class CardCreateSerializer(serializers.ModelSerializer):

    assigned_to = serializers.ChoiceField(choices=ChoiceLoader(
        User, ['id'], ['get_full_name'], empty_line="---------"
    ).get_data())
    status = serializers.ChoiceField(choices=ChoiceLoader(
        Status, ['id', 'name']
    ).get_data())
    role = serializers.ChoiceField(choices=ChoiceLoader(
        Role, ['id', 'name']
    ).get_data())

    class Meta:
        model = Card
        fields = ('id', 'title', 'description', 'assigned_to', 'due_date',
                  'owner', 'status', 'role')
