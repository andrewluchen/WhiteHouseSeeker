from rest_framework import serializers

from usgs.character.models import Character


class CharacterSerializer(serializers.Serializer):
    id = serializers.ReadOnlyField()
    username = serializers.SerializerMethodField()
    user_id = serializers.SerializerMethodField()
    description = serializers.CharField()
    primary = serializers.BooleanField()
    name = serializers.CharField()
    title = serializers.SerializerMethodField()
    birthday = serializers.SerializerMethodField()
    gender = serializers.CharField()
    residence = serializers.CharField()
    party = serializers.CharField()
    state = serializers.CharField()
    avatar = serializers.CharField()
    bio = serializers.CharField()
    activated = serializers.SerializerMethodField()
    deactivated = serializers.SerializerMethodField()
    warchest = serializers.SerializerMethodField()

    def get_username(self, obj):
        return obj.player.username

    def get_user_id(self, obj):
        return obj.player.id

    def get_title(self, obj):
        return obj.get_title()

    def get_birthday(self, obj):
        return str(obj.birthday)

    def get_activated(self, obj):
        return str(obj.activated)

    def get_deactivated(self, obj):
        return str(obj.deactivated)

    def get_warchest(self, obj):
        amount = 0
        for incoming in obj.warchest.incoming.all():
            amount += incoming.amount
        for outgoing in obj.warchest.outgoing.all():
            amount -= outgoing.amount
        return {
            'id': obj.warchest.id,
            'amount': amount,
        }

    class Meta:
        model = Character
        fields = (
            'id',
            'username',
            'user_id',
            'description',
            'primary',
            'name',
            'title',
            'birthday',
            'gender',
            'residence',
            'party',
            'state',
            'avatar',
            'bio',
            'activated',
            'deactivated',
        )

class VotingRecordSerializer(serializers.Serializer):
    yeas = serializers.SerializerMethodField()
    nays = serializers.SerializerMethodField()
    pres = serializers.SerializerMethodField()

    @staticmethod
    def create_votes(vote_objs):
        votes = []
        for v in vote_objs:
            votes.append({
                'vote_id': v.id,
                'title': v.subject.bill.description,
                'endtime': str(v.endtime),
            })
        return votes

    def get_yeas(self, obj):
        yea_votes = obj.yea_votes.all()
        return VotingRecordSerializer.create_votes(yea_votes)

    def get_nays(self, obj):
        nay_votes = obj.nay_votes.all()
        return VotingRecordSerializer.create_votes(nay_votes)

    def get_pres(self, obj):
        pres_votes = obj.pres_votes.all()
        return VotingRecordSerializer.create_votes(pres_votes)

    class Meta:
        model = Character
        fields = (
            'yeas',
            'nays',
            'pres',
        )
