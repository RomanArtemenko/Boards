from django.shortcuts import render
from django.contrib.auth import get_user_model
from django.contrib.sites.shortcuts import get_current_site
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes, force_text
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.http import HttpResponse
from django.views import View
from rest_framework import viewsets
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from .serializers import UserSerializer, SignUpSerializer, SignInSerializer
from .tokens import account_activation_token
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
        # out_serializer = UserSerializer(serializer.instance)
        confirm = ConfirmEmailView(self.request, serializer.instance)
        confirm.request_confirm()
        return Response("Confirm your email address to complete the registration",
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


class ActivationView(View):

    def get(self, uidb64, token):
        try:
            uid = force_text(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except(TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None
        if user is not None and account_activation_token.check_token(user, token):
            user.is_active = True
            user.save()
            # return redirect('home')
            return HttpResponse('Thank you for your email confirmation. Now you can login your account.')
        else:
            return HttpResponse('Activation link is invalid!')


class ConfirmEmailView():
    mail_subject = 'Activate your account.'
    mail_teplate = 'custom_auth/template_confirm_registration.html'

    def __init__(self, request, user):
        self.domain = get_current_site(request).domain
        self.user = user
        self.uid = urlsafe_base64_encode(force_bytes(user.pk))
        self.token = account_activation_token.make_token(user)

    def _make_body(self):
        body = render_to_string(self.mail_teplate, {
                'user': self.user,
                'domain': self.domain,
                'uid': self.uid,
                'token': self.token,
            })

        return body

    def request_confirm(self):
        email = EmailMessage(
            subject=self.mail_subject,
            body=self._make_body(),
            to=[self.user.email]
        )
        email.send()






