from django.urls import path
from .views import index

urlpatterns = [
    path('home', index),
    path('login', index),
    path('find-duel', index),
    path('duel', index),
    path('leaderboard', index),
    path('voting', index),
]
