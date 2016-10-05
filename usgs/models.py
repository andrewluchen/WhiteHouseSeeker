from datetime import datetime

from django.contrib.auth.models import User
from django.db import models


class Character(models.Model):
    player = models.ForeignKey(User, related_name='characters')
    primary = models.BooleanField()
    activated = models.DateTimeField(default=datetime.now)
    deactivated = models.DateTimeField(null=True, blank=True)

    name = models.CharField(max_length=80)
    birthday = models.DateField()
    gender = models.CharField(max_length=2)
    residence = models.CharField(max_length=80)
    party = models.CharField(max_length=80)
    state = models.CharField(max_length=80)
    avatar = models.TextField(default='', blank=True)
    bio = models.TextField(default='', blank=True)
    title = models.CharField(max_length=80, default='', blank=True)


class CharacterIdField(models.IntegerField):

    def value_to_string(self, obj):
        if (not obj):
            return 'None'
        character = Character.objects.get(id=obj)
        if (len(character) == 0):
            return 'None'
        else:
            character = character[0]
            return character.name + '(' + character.party[0] + '-' + character.state + ')'


class Leadership(models.Model):
    potus = CharacterIdField(null=True)
    vpotus = CharacterIdField(null=True)
    speaker = CharacterIdField(null=True)
    majorityleader = CharacterIdField(null=True)
    majoritywhip = CharacterIdField(null=True)
    minoirtyleader = CharacterIdField(null=True)
    minoritywhip = CharacterIdField(null=True)


class LegislativeBody(models.Model):
    name = models.CharField(max_length=80, unique=True)
    parent = models.ForeignKey('self', related_name='children', null=True, blank=True)


BILL_CLERK = 'Introduced'
BILL_DEBATE = 'In Debate'
BILL_VOTE = 'In Vote'
BILL_PASS = 'Passed'
BILL_FAIL = 'Failed'
BILL_POTUS = 'Presented to the President'
BILL_SIGN = 'Sign into Law'
BILL_VETO = 'Vetoed by the President'
BILL_OVERRIDE = 'Passed over veto'


class Bill(models.Model):
    title = models.TextField()
    sponsor = models.ForeignKey(Character, related_name='sponsored_bills')
    cosponsors = models.ManyToManyField(Character, related_name='cosponsored_bills', blank=True)


class BillVersion(models.Model):
    bill = models.ForeignKey(Bill, related_name='versions')
    status = models.CharField(max_length=100)
    closed = models.BooleanField(default=False, blank=True)
    body = models.TextField()
    modified = models.DateTimeField()
    location = models.ForeignKey(LegislativeBody, related_name='bills')


class Debate(models.Model):
    subject = models.ForeignKey(Bill, related_name='debates')
    starttime = models.DateTimeField()
    endtime = models.DateTimeField()
    location = models.ForeignKey(LegislativeBody, related_name='debates')


class Vote(models.Model):
    subject = models.ForeignKey(Bill, related_name='votes')
    starttime = models.DateTimeField()
    endtime = models.DateTimeField()
    location = models.ForeignKey(LegislativeBody, related_name='votes')
    yeas = models.ManyToManyField(Character, related_name='yea_votes', blank=True)
    nays = models.ManyToManyField(Character, related_name='nay_votes', blank=True)
    pres = models.ManyToManyField(Character, related_name='pres_votes', blank=True)
