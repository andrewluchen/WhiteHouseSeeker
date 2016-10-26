from rest_framework import serializers

from usgs.character.models import Character
from usgs.election.models import Campaign, CampaignDay, Election, ElectionDay, Fundraiser, Warchest


class WarchestSerializer(serializers.Serializer):
    id = serializers.ReadOnlyField()
    character = serializers.SerializerMethodField()
    current = serializers.SerializerMethodField()
    transactions = serializers.SerializerMethodField()

    def get_character(self, obj):
        character = Character.objects.get(id=obj.character.id)
        return {
            'id': character.id,
            'name': character.name,
        }

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
            'character',
            'current',
            'transactions',
        )


class ElectionSummarySerializer(serializers.Serializer):
    id = serializers.ReadOnlyField()
    summary = serializers.SerializerMethodField()
    description = serializers.CharField()
    year = serializers.IntegerField()
    can_file = serializers.BooleanField()
    candidates = serializers.SerializerMethodField()

    def get_summary(self, obj):
        return 'TODO'

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
            'summary',
            'description',
            'year',
            'can_file',
            'candidates',
        )


class ElectionSerializer(serializers.Serializer):
    id = serializers.ReadOnlyField()
    summary = serializers.SerializerMethodField()
    description = serializers.CharField()
    year = serializers.IntegerField()
    can_file = serializers.BooleanField()
    candidates = serializers.SerializerMethodField()
    days = serializers.SerializerMethodField()

    def get_summary(self, obj):
        return 'TODO'

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

    def get_days(self, obj):
        days = obj.days.all()
        days = sorted(days, lambda ed: (-100 if ed.primary else 0) + ed.day)
        return ElectionDaySerializer(days, many=True).data

    class Meta:
        model = Election
        fields = (
            'id',
            'summary',
            'description',
            'year',
            'can_file',
            'candidates',
            'days',
        )


class ElectionDaySerializer(serializers.Serializer):
    id = serializers.ReadOnlyField()
    primary = serializers.BooleanField()
    day = serializers.IntegerField()
    closed = serializers.BooleanField()
    campaigns = serializers.ReadOnlyField()
    comments = serializers.CharField()

    def get_campagins(self, obj):
        return CampaignDaySerializer(obj.campaigns.all(), many=True).data

    class Meta:
        model = ElectionDay
        fields = (
            'id',
            'primary',
            'day',
            'closed',
            'campaigns',
            'comments',
        )


class CampaignDaySerializer(serializers.Serializer):
    id = serializers.ReadOnlyField()
    elction_id = serializers.SerializerMethodField()
    body = serializers.CharField()
    costs = serializers.IntegerField()
    closed = serializers.SerializerMethodField()
    timestamp = serializers.DateTimeField()

    def get_election_id(self, obj):
        return obj.day.election.id

    def get_closed(self, obj):
        return obj.day.closed

    def get_timestamp(self, obj):
        return str(obj.timestamp)

    class Meta:
        model = ElectionDay
        fields = (
            'id',
            'election_id',
            'body',
            'costs',
            'closed',
            'timestamp',
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
            return {
                'character': {
                    'name': candidate.name,
                    'party': candidate.party,
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
