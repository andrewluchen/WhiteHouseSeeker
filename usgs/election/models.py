import datetime

from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone

from usgs.character.models import ElectionCharacter


class Election(models.Model):
    winner = models.ForeignKey(ElectionCharacter, null=True, blank=True)
    description = models.TextField()
    year = models.IntegerField()
    started = models.BooleanField(default=False, blank=True)
    modified = models.DateField(default=datetime.date.today, blank=True)

    def __unicode__(self):
        return self.description

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
    description = models.TextField()
    timestamp = models.DateTimeField(default=timezone.now, blank=True)


class Fundraiser(models.Model):
    campaign = models.ForeignKey(Campaign, related_name='fundraisers')
    description = models.TextField()
    transaction = models.ForeignKey(Transaction, related_name='+')
    timestamp = models.DateTimeField(default=timezone.now, blank=True)


class CampaignDay(models.Model):
    campaign = models.ForeignKey(Campaign, related_name='days')
    day = models.IntegerField()
    organization_cost = models.ForeignKey(Transaction, related_name='+')
    advertisement_cost = models.ForeignKey(Transaction, null=True, blank=True, related_name='+')
    fundraiser_income = models.ForeignKey(Transaction, null=True, blank=True, related_name='+')
    description = models.TextField()
    timestamp = models.DateTimeField(default=timezone.now, blank=True)
