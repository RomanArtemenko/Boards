from django.shortcuts import render
from rest_framework import viewsets
from .models import Card
from .serializers import CardSerializer

# Create your views here.


class CardViewSet(viewsets.ModelViewSet):
    serializer_class = CardSerializer
    queryset = Card.objects.all()



