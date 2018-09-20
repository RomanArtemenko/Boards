from django.shortcuts import render
from django.contrib.auth import get_user_model
from rest_framework import viewsets
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from .serializers import UserSerializer, SignUpSerializer, SignInSerializer
User = get_user_model()

# Create your views here.


#API
class SingUp(viewsets.mixins.CreateModelMixin, viewsets.GenericViewSet):
    queryset = User.objects.all()
    serializer_class = SignUpSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers({})
        out_serializer = UserSerializer(serializer.instance)
        return Response(out_serializer.data,
                        status=status.HTTP_201_CREATED, headers=headers)


class SignIn(viewsets.mixins.CreateModelMixin, viewsets.GenericViewSet):
    queryset = Token.objects.all()
    serializer_class = SignInSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers({})
        out_data = 'Token %s' % serializer.instance.key
        return Response(out_data,
                        status=status.HTTP_200_OK, headers=headers)


