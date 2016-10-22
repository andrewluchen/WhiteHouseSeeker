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
