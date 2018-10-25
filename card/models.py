from django.core.exceptions import EmptyResultSet
from django.db import models
from django.db.utils import OperationalError
from django.contrib.auth import get_user_model
User = get_user_model()

# Create your models here.


class Status(models.Model):
    name = models.CharField(max_length=20, unique=True)
    is_actuve = models.BooleanField(
        null=False,
        default=True,
    )
    order_num = models.IntegerField()
    is_default = models.BooleanField(
        null=False,
        default=False,
    )

    def get_default_status():
        try:
            instance = Status.objects.get(is_default=True)
        except (EmptyResultSet, OperationalError,):
            instance = None

        return instance


class Role(models.Model):
    name = models.CharField(max_length=20, unique=True)


class Collection(models.Model):
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=1000)
    created_by = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
    )


class Card(models.Model):
    title = models.CharField(max_length=100)
    description = models.CharField(max_length=1000)
    assigned_to = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        blank=True,
        null=True,
        related_name='performer',
    )
    due_date = models.DateTimeField(blank=True)
    created_date = models.DateTimeField(auto_now_add=True)
    owner = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name='owner',
    )
    status = models.ForeignKey(
        Status,
        on_delete=models.PROTECT,
        # default=Status.get_default_status(),
    )
    role = models.ManyToManyField(Role, blank=True)
    collection = models.ForeignKey(
        Collection,
        on_delete=models.PROTECT,
        blank=True,
        null=True,
        related_name='cards',
    )


class Board(models.Model):
    CHOICES_BOARD_TYPE = (
        ('K', 'Kanban'),
        ('S', 'Scrum'),
    )

    name = models.CharField(max_length=100)
    type = models.CharField(
        max_length=1,
        choices=CHOICES_BOARD_TYPE,
    )
    collection = models.ForeignKey(
        Collection,
        on_delete=models.PROTECT,
        related_name='boards',
        blank=True,
        null=True,
    )
    card = models.ManyToManyField(
        'Card',
        related_name='boards'
    )
