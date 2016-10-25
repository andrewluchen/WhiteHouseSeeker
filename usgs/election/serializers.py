from rest_framework import serializers

from usgs.character.models import Character
from usgs.election.models import Campaign, Election, Fundraiser, Warchest


class WarchestSerializer(serializers.Serializer):
    id = serializers.ReadOnlyField()
    current = serializers.SerializerMethodField()
    transactions = serializers.SerializerMethodField()

    def get_current(self, obj):
        amount = 0
        for incoming in obj.incoming.all():
            amount += incoming.amount
        for outgoing in obj.outgoing.all():
            amount -= outgoing.amount
        return amount

    def get_transactions(self, obj):
        transaction_objs = list(obj.incoming.all()) + list(obj.outgoing.all())
        transaction_objs = reversed(sorted(transaction_objs, key=lambda t: t.timestamp))
        transactions = []
        for t in transaction_objs:
            transactions.append({
                'id': t.id,
                'sign': '+' if t.receiver == obj else '-',
                'amount': t.amount,
                'description': t.description,
                'timestamp': t.timestamp,
            })
        return transactions

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
            'fundraisers',
        )


class FundraiserSerializer(serializers.Serializer):
    id = serializers.ReadOnlyField()
    description = serializers.CharField()
    amount = serializers.SerializerMethodField()
    comment = serializers.SerializerMethodField()
    timestamp = serializers.SerializerMethodField()

    def get_amount(self, obj):
        return obj.transaction.amount

    def get_comment(self, obj):
        return obj.transaction.description

    def get_timestamp(self, obj):
        return str(obj.timestamp)

    class Meta:
        model = Fundraiser
        fields = (
            'id',
            'description',
            'amount',
            'timestamp',
        )


class CampaignSerializer(serializers.Serializer):
    id = serializers.ReadOnlyField()
    withdrawn = serializers.BooleanField()
    description = serializers.CharField()
    election = serializers.SerializerMethodField()
    candidate = serializers.SerializerMethodField()
    warchest = serializers.SerializerMethodField()
    fundraisers = serializers.SerializerMethodField()

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

    def get_fundraisers(self, obj):
        return FundraiserSerializer(obj.fundraisers, many=True).data

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
