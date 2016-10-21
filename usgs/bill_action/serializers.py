from rest_framework import serializers

from usgs.bill_action.models import Debate, DebateComment, DebateMotion, Vote


class DebateSerializer(serializers.Serializer):
    id = serializers.ReadOnlyField()
    bill_id = serializers.SerializerMethodField()
    title = serializers.SerializerMethodField()
    body = serializers.SerializerMethodField()
    location = serializers.SerializerMethodField()
    starttime = serializers.SerializerMethodField()
    comments = serializers.SerializerMethodField()
    motions = serializers.SerializerMethodField()

    def get_bill_id(self, obj):
        return obj.subject.bill.id

    def get_title(self, obj):
        return obj.subject.bill.description

    def get_body(self, obj):
        return obj.subject.body

    def get_location(self, obj):
        return obj.subject.location.name

    def get_starttime(self, obj):
        return str(obj.starttime)

    def get_endtime(self, obj):
        return str(obj.endtime)

    def get_comments(self, obj):
        return DebateCommentSerializer(obj.comments, many=True).data

    def get_motions(self, obj):
        return DebateMotionSerializer(obj.motions, many=True).data

    class Meta:
        model = Debate
        fields = (
            'id',
            'bill_id',
            'title',
            'body',
            'location',
            'starttime',
            'endtime',
            'comments',
            'motions',
        )


class DebateCommentSerializer(serializers.Serializer):
    id = serializers.ReadOnlyField()
    character = serializers.SerializerMethodField()
    comment = serializers.CharField()
    timestamp = serializers.SerializerMethodField()

    def get_character(self, obj):
        return {
            'id': obj.actor.id,
            'name': obj.actor.description,
            'party': obj.actor.party,
        }
        return obj.actor.id

    def get_timestamp(self, obj):
        return str(obj.timestamp)

    class Meta:
        model = DebateComment
        fields = (
            'id',
            'character',
            'comment',
            'timestamp',
        )


class DebateMotionSerializer(serializers.Serializer):
    id = serializers.ReadOnlyField()
    actor = serializers.SerializerMethodField()
    seconded = serializers.SerializerMethodField()
    motion_type = serializers.CharField()
    amendment = serializers.CharField()
    active = serializers.BooleanField()
    location = serializers.SerializerMethodField()
    starttime = serializers.SerializerMethodField()
    endtime = serializers.SerializerMethodField()
    yeas = serializers.SerializerMethodField()
    nays = serializers.SerializerMethodField()
    pres = serializers.SerializerMethodField()

    def get_actor(self, obj):
        return {
            'id': obj.actor.id,
            'name': obj.actor.description,
            'party': obj.actor.party,
        }

    def get_seconded(self, obj):
        if obj.seconded:
            return {
                'id': obj.seconded.id,
                'name': obj.seconded.description,
                'party': obj.seconded.party,
            }
        else:
            return None

    def get_location(self, obj):
        return obj.debate.location.name

    def get_starttime(self, obj):
        return str(obj.starttime)

    def get_endtime(self, obj):
        return str(obj.endtime) if obj.endtime else None

    @staticmethod
    def create_votes(characters):
        votes = []
        for c in characters:
            votes.append({
                'id': c.id,
                'name': c.description,
                'party': c.party,
            })
        return votes

    def get_yeas(self, obj):
        return DebateMotionSerializer.create_votes(obj.yeas.all())

    def get_nays(self, obj):
        return DebateMotionSerializer.create_votes(obj.nays.all())

    def get_pres(self, obj):
        return DebateMotionSerializer.create_votes(obj.pres.all())

    class Meta:
        model = DebateMotion
        fields = (
            'id',
            'actor',
            'seconded',
            'motion_type',
            'amendment',
            'active',
            'location',
            'starttime',
            'endtime',
            'yeas',
            'nays',
            'pres',
        )


class VoteSerializer(serializers.Serializer):
    id = serializers.ReadOnlyField()
    bill_id = serializers.SerializerMethodField()
    yeas = serializers.SerializerMethodField()
    nays = serializers.SerializerMethodField()
    pres = serializers.SerializerMethodField()
    title = serializers.SerializerMethodField()
    body = serializers.SerializerMethodField()
    location = serializers.SerializerMethodField()
    starttime = serializers.SerializerMethodField()
    endtime = serializers.SerializerMethodField()
    past_locations = serializers.SerializerMethodField()

    def get_bill_id(self, obj):
        return obj.subject.bill.id

    @staticmethod
    def create_votes(characters):
        votes = []
        for c in characters:
            votes.append({
                'id': c.id,
                'name': c.description,
                'party': c.party,
            })
        return votes

    def get_yeas(self, obj):
        return VoteSerializer.create_votes(obj.yeas.all())

    def get_nays(self, obj):
        return VoteSerializer.create_votes(obj.nays.all())

    def get_pres(self, obj):
        return VoteSerializer.create_votes(obj.pres.all())

    def get_title(self, obj):
        return obj.subject.bill.description

    def get_body(self, obj):
        return obj.subject.body

    def get_location(self, obj):
        return obj.subject.location.name

    def get_starttime(self, obj):
        return str(obj.starttime)

    def get_endtime(self, obj):
        return str(obj.endtime)

    def get_past_locations(self, obj):
        past_locations = []
        versions = obj.subject.bill.versions.all()
        for bv in list(versions):
            past_locations.append(bv.location.name)
        return past_locations

    class Meta:
        model = Vote
        fields = (
            'id',
            'bill_id',
            'yeas',
            'nays',
            'pres',
            'title',
            'body',
            'location',
            'starttime',
            'endtime',
            'past_locations',
        )
