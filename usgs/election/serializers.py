from rest_framework import serializers

from usgs.character.models import Character
from usgs.election.models import Campaign, Election, Warchest


class WarchestSerializer(serializers.Serializer):
    id = serializers.ReadOnlyField()
    current = serializers.SerializerMethodField()

    def get_current(self, obj):
        amount = 0
        for incoming in obj.incoming.all():
            amount += incoming.amount
        for outgoing in obj.outgoing.all():
            amount -= outgoing.amount
        return amount

    class Meta:
        model = Warchest
        fields = (
            'id',
            'current'
        )


class ElectionSerializer(serializers.Serializer):
    id = serializers.ReadOnlyField()
    winner = serializers.BooleanField()
    description = serializers.CharField()
    year = serializers.IntegerField()
    started = serializers.BooleanField()
    modified = serializers.DateField()
    candidates = serializers.SerializerMethodField()

    def get_candidates(self, obj):
        characters = []
        for c in obj.campaigns.all():
            candidate = c.candidate
            character = Character.objects.filter(id=candidate.id)
            if (character):
                character = character.first()
                characters.append({
                    'campaign_id': c.id,
                    'withdrawn': c.withdrawn,
                    'character': {
                        'id': character.id,
                        'name': character.description,
                        'party': character.party,
                    },
                    'user_id': character.player.id,
                    'user_username': character.player.username,
                })
            else:
                party = None
                if ('Democrat' in candidate.name):
                    party = 'Democratic'
                elif ('Republican' in candidate.name):
                    party = 'Republican'
                characters.append({
                    'campaign_id': c.id,
                    'withdrawn': c.withdrawn,
                    'character': {
                        'name': candidate.name,
                        'party': party,
                    },
                })
        return characters

    class Meta:
        model = Election
        fields = (
            'id',
            'winner',
            'description',
            'year',
            'started',
            'modified',
            'candidates',
        )


class CampaignSerializer(serializers.Serializer):
    id = serializers.ReadOnlyField()
    withdrawn = serializers.BooleanField()
    description = serializers.CharField()
    election = serializers.SerializerMethodField()
    candidate = serializers.SerializerMethodField()
    warchest = serializers.SerializerMethodField()

    def get_election(self, obj):
        return {
            'id': obj.election.id,
            'name': obj.election.description,
        }

    def get_candidate(self, obj):
        candidate = obj.candidate
        character = Character.objects.filter(id=candidate.id)
        if (character):
            character = character.first()
            return {
                'character': {
                    'id': character.id,
                    'name': character.description,
                    'party': character.party,
                },
                'user_id': character.player.id,
                'user_username': character.player.username,
            }
        else:
            party = None
            if ('Democrat' in candidate.name):
                party = 'Democratic'
            elif ('Republican' in candidate.name):
                party = 'Republican'
            return {
                'character': {
                    'name': candidate.name,
                    'party': party,
                },
            }

    def get_warchest(self, obj):
        return WarchestSerializer(obj.candidate.warchest).data

    class Meta:
        model = Campaign
        fields = (
            'id',
            'withdrawn',
            'description',
            'election',
            'candidate',
            'warchest'
        )
