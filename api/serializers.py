from rest_framework import serializers
from .models import Duel, Vote, Genre


class DuelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Duel
        fields = (
            'id',
            'code',
            'genre',
            'player_1',
            'player_2',
            'status',
            'duration',
            'track_duration',
        )


class VoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vote
        fields = ('duel', 'user', 'player')


class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ('genre_name',)
