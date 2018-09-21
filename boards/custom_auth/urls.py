from django.conf.urls import url
from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'signup', views.SingUp)
router.register(r'signin', views.SignIn)

urlpatterns = [
    # path('activate/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$', views.ActivationView.as_view(), name='activate'),
    url(r'^activate/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$',
        views.ActivationView.as_view(), name='activate'),
    path('', include(router.urls)),
]
