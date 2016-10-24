from rest_framework import serializers

from usgs.character.models import Character


class ElectionSerializer(serializers.Serializer):
    id = serializers.ReadOnlyField()
    winner = serializers.BooleanField()
    description = serializers.CharField()

    class Meta:
        model = Character
        fields = (
            'id',
            'winner',
            'description',
        )
