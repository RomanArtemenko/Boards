from django.conf.urls import url
from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'signup', views.SingUp)
router.register(r'signin', views.SignIn)

urlpatterns = [
    path('', include(router.urls)),
]
