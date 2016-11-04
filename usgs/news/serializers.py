from django.utils import timezone

from rest_framework import serializers

from usgs.news.models import Tweet


class TweetSerializer(serializers.Serializer):
    id = serializers.ReadOnlyField()
    author = serializers.SerializerMethodField()
    handle = serializers.CharField()
    tweet = serializers.CharField()
    hashtags = serializers.CharField()
    created = serializers.SerializerMethodField()
    score = serializers.SerializerMethodField()
    relevance = serializers.SerializerMethodField()

    def get_author(self, obj):
        return obj.author.username

    def get_created(self, obj):
        return str(obj.created)

    def get_score(self, obj):
        return obj.ups.count() - obj.downs.count()

    # higher ==> more relevant
    def get_relevance(self, obj):
        delta = timezone.now() - obj.created
        freshness = -30 * (delta.days / 3)
        votes = 5 * (obj.ups.count() + obj.downs.count())
        return freshness + votes

    class Meta:
        model = Tweet
        fields = (
            'id',
            'author',
            'handle',
            'tweet',
            'hashtags',
            'created',
            'score',
            'relevance'
        )
