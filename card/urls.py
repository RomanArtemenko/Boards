from django.conf.urls import url
from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter
from rest_framework_extensions.routers import ExtendedSimpleRouter

# router = DefaultRouter()
# router.register(r'card', views.CardViewSet)
# router.register(r'role', views.RoleViewSet)
# router.register(r'status', views.StatusViewSet)
# router.register(r'collection', views.CollectionViewSet)
# router.register(r'board', views.BoardViewSet)



ext_router = ExtendedSimpleRouter()

ext_router.register(r'board', views.BoardViewSet, base_name='board')\
    .register(r'card',
              views.CardViewSet,
              base_name='boards-card',
              parents_query_lookups=['boards__card'])

# ext_router.register(r'card', views.CardViewSet, base_name='card')\
#     .register(r'board',
#               views.BoardViewSet,
#               base_name='card-boards',
#               parents_query_lookups=['card_boards'])

urlpatterns = [
    # path('', include(router.urls)),
] + ext_router.urls