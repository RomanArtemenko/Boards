from django.conf.urls import url
from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'card', views.CardViewSet)
router.register(r'role', views.RoleViewSet)
router.register(r'status', views.StatusViewSet)
router.register(r'collection', views.CollectionViewSet)
router.register(r'board', views.BoardViewSet)

urlpatterns = [
    path('', include(router.urls)),
]