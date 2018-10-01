from django.db import models
from django.contrib.auth import get_user_model
User = get_user_model()

# Create your models here.


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
