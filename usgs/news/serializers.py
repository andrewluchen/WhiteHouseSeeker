from django.utils import timezone

from rest_framework import serializers

from usgs.news.models import NewsNetwork, NewsArticle, Tweet

class NewsArticleSerializers(serializers.Serializer):
    id = serializers.ReadOnlyField()
    author = serializers.SerializerMethodField()
    body = serializers.CharField()

    def get_author(self, obj):
        return obj.author.username

    class Meta:
        model = NewsArticle
        fields = (
            'id',
            'author',
            'body',
        )


class NewsNetworkSerializer(serializers.Serializer):
    id = serializers.ReadOnlyField()
    is_admin = serializers.BooleanField()
    name = serializers.CharField()
    description = serializers.CharField()
    articles = serializers.SerializerMethodField()

    def get_articles(self, obj):
        return NewsArticleSerializers(obj.articles, many=True).data

    class Meta:
        model = NewsNetwork
        fields = (
            'id',
            'is_admin',
            'name',
            'description',
        )


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
        freshness = -60 * (delta.days / 3)
        votes = 10 * (obj.ups.count() + obj.downs.count())
        return freshness + votes + obj.ups.count() - obj.downs.count()

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
