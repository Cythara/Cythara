from django.contrib import admin

from api.models import User, Genre, Duel, Vote

admin.site.register(User)
admin.site.register(Genre)
admin.site.register(Duel)
admin.site.register(Vote)
