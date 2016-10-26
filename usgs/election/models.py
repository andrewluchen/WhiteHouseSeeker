import datetime

from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone

from usgs.character.models import ElectionCharacter


class Election(models.Model):
    description = models.TextField()
    year = models.IntegerField()
    can_file = models.BooleanField(default=True, blank=True)
    winner = models.ForeignKey(ElectionCharacter, null=True, blank=True, related_name='+')

    def __unicode__(self):
        return self.description

    def __str__(self):
        return self.__unicode__()


class ElectionDay(models.Model):
    election = models.ForeignKey(Election, related_name='days')
    primary = models.BooleanField(default=False, blank=True)
    day = models.IntegerField()
    comments = models.TextField()
    closed = models.BooleanField(default=False, blank=True)

    def __unicode__(self):
        return (
            self.election.description + ' -- ' +
            ('Primary ' if self.primary else '') +
            'Day ' + str(self.day)
        )

    def __str__(self):
        return self.__unicode__()


class Campaign(models.Model):
    election = models.ForeignKey(Election, related_name='campaigns')
    candidate = models.ForeignKey(ElectionCharacter, related_name='campaigns')
    description = models.CharField(max_length=140)
    withdrawn = models.BooleanField(default=False, blank=True)

    def __unicode__(self):
        return self.candidate.name + ' -- ' + self.election.description

    def __str__(self):
        return self.__unicode__()


class Warchest(models.Model):
    character = models.OneToOneField(ElectionCharacter, related_name='warchest')

    def __unicode__(self):
        return self.character.name + '\'s Warchest'

    def __str__(self):
        return self.__unicode__()


class Transaction(models.Model):
    amount = models.IntegerField()
    sender = models.ForeignKey(Warchest, null=True, blank=True, related_name='outgoing')
    receiver = models.ForeignKey(Warchest, null=True, blank=True, related_name='incoming')
    description = models.CharField(max_length=140)
    timestamp = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return self.description

    def __str__(self):
        return self.__unicode__()


class Fundraiser(models.Model):
    campaign = models.ForeignKey(Campaign, related_name='fundraisers')
    body = models.TextField()
    transaction = models.ForeignKey(Transaction, related_name='+')
    timestamp = models.DateTimeField(default=timezone.now, blank=True)

    def __unicode__(self):
        return self.transaction.description

    def __str__(self):
        return self.__unicode__()


class CampaignDay(models.Model):
    campaign = models.ForeignKey(Campaign, related_name='days')
    day = models.ForeignKey(ElectionDay, related_name='campaigns')
    body = models.TextField()
    costs = models.IntegerField(default=0, blank=True)
    timestamp = models.DateTimeField(default=timezone.now, blank=True)
