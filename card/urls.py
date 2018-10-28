from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter
from rest_framework_extensions.routers import ExtendedSimpleRouter

router = DefaultRouter()
router.register(r'card', views.CardViewSet)
router.register(r'role', views.RoleViewSet)
router.register(r'status', views.StatusViewSet)
router.register(r'collection', views.CollectionViewSet)
router.register(r'board', views.BoardViewSet)


ext_router = ExtendedSimpleRouter()

ext_router.register('boards', views.BoardViewSet, base_name='boards')\
    .register('cards',
              views.CardNestedViewSet,
              base_name='boards-card',
              parents_query_lookups=['boards__id'])

urlpatterns = [
    path('', include(router.urls)),
] + ext_router.urls

