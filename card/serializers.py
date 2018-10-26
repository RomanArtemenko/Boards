from django.contrib.auth import get_user_model
from django.db import ProgrammingError
from rest_framework import serializers
from .models import Card, Status, Role, Collection, Board
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


class CollectionLightSerializer(serializers.ModelSerializer):

    class Meta:
        model = Collection
        fields = ('id', 'name')


class CardSerializer(serializers.ModelSerializer):
    assigned_to = UserLiteSerializer(read_only=True, allow_null=True)
    owner = UserLiteSerializer(read_only=True)
    status = StatusSerializer(allow_null=True)
    role = RoleSerializer(many=True, allow_null=True)
    collection = CollectionLightSerializer(allow_null=True)

    class Meta:
        model = Card
        fields = ('id', 'title', 'description', 'due_date',
                  'owner', 'status', 'role', 'created_date',
                  'assigned_to', 'collection')


class ChoiceLoader():

    def __init__(self, queryset, fields=None, methods=None, empty_line=None):

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
                for item in queryset
            ]
        except (AttributeError, EmptyResultSet,
                OperationalError, ProgrammingError):
            self._data = []

        if empty_line is not None:
            self._data = self._data + [[None, empty_line]]

    def get_data(self):
        return list(self._data)


class CardCreateSerializer(serializers.ModelSerializer):

    assigned_to_id = serializers.ChoiceField(choices=ChoiceLoader(
        User.objects.all(),
        ['id'],
        ['get_full_name'],
        empty_line="---------"
    ).get_data())
    status_id = serializers.ChoiceField(choices=ChoiceLoader(
        Status.objects.all(),
        ['id', 'name']
    ).get_data())
    role_id = serializers.MultipleChoiceField(choices=ChoiceLoader(
        Role.objects.all(),
        ['id', 'name']
    ).get_data(),
                                   allow_null=True)
    collection_id = serializers.ChoiceField(choices=ChoiceLoader(
        Collection.objects.all(),
        ['id', 'name']
    ).get_data(),
                                            allow_null=True)

    class Meta:
        model = Card
        fields = ('id', 'title', 'description', 'assigned_to_id', 'due_date',
                  'owner', 'status_id', 'role_id', 'collection_id')


class BoardSerializer(serializers.ModelSerializer):
    card = CardSerializer(many=True, allow_null=True)

    class Meta:
        model = Board
        fields = ('id', 'name', 'type', 'collection', 'card')


class BoardCreateSerializer(serializers.ModelSerializer):
    card = serializers.PrimaryKeyRelatedField(many=True, read_only=True, allow_null=True)

    class Meta:
        model = Board
        fields = ('id', 'name', 'type', 'collection', 'card')

    def save(self, **kwargs):
        cards = self.initial_data.pop('card', [])

        super(BoardCreateSerializer, self).save(**kwargs)

        if self.instance:
            for obj in Card.objects.filter(id__in=cards):
                self.instance.card.add(obj)
        return self.instance


class CollectionSerializer(serializers.ModelSerializer):
    created_by = UserLiteSerializer(read_only=True)
    cards = CardSerializer(read_only=True, many=True)
    boards = BoardSerializer(read_only=True, many=True)

    class Meta:
        model = Collection
        fields = ('id', 'name', 'description', 'created_by', 'cards', 'boards')
