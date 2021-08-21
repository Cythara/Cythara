from django.db.models import fields
from rest_framework import serializers
from .models import Duel, Vote


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
