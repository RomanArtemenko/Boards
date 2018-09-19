from django.shortcuts import render
from rest_framework import viewsets
from django.contrib.auth import get_user_model
User = get_user_model()

# Create your views here.


#API
class SingUp(viewsets.mixins.CreateModelMixin, viewsets.GenericViewSet):
    qeuryset = User.objects.all()
    serializer_class = None

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers({})

        return Response(serializer.data,
                        status=status.HTTP_201_CREATED, headers=headers)

