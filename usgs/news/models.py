from django.contrib.auth.models import User
from django.db import models


class NewsNetwork(models.Model):
    is_admin = models.BooleanField(default=False)
    name = models.CharField(max_length=200)
    description = models.TextField()


class NewsArticle(models.Model):
    network = models.ForeignKey(NewsNetwork, related_name='articles')
    author = models.ForeignKey(User, related_name='+')
    body = models.TextField()


class Tweet(models.Model):
    author = models.ForeignKey(User, related_name='+')
    handle = models.CharField(max_length=80)
    tweet = models.CharField(max_length=200)
    hashtags = models.CharField(max_length=200)
    created = models.DateTimeField(auto_now=True)
    ups = models.ManyToManyField(User, related_name='+', blank=True)
    downs = models.ManyToManyField(User, related_name='+', blank=True)

    def __unicode__(self):
        return self.tweet[:80]

    def __str__(self):
        return self.__unicode__()
