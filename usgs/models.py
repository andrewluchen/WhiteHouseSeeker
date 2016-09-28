from django.contrib.auth.models import User
from django.db import models

class Character(models.Model):
    player = models.ForeignKey(User, related_name='characters')
    name = models.TextField()
    party = models.TextField()
    state = models.TextField()
    active = models.BooleanField()

class CharacterIdField(models.IntegerField):

    def value_to_string(self, obj):
        if (not obj):
            return 'None'
        character = models.Leadership.objects.get(id=obj)
        if (len(character) == 0):
            return 'None'
        else:
            character = character[0]
            return character.name + '(' + character.party[0] + '-' + character.state + ')'

class Bill(models.Model):
    title = models.TextField()
    body = models.TextField()
    sponsor = models.ForeignKey(Character, related_name='sponsored_bills')
    cosponsors = models.ManyToManyField(Character, related_name='cosponsored_bills')

class Vote(models.Model):
    subject = models.ForeignKey(Bill, related_name='votes')
    yeas = models.ManyToManyField(Character, related_name='yea_votes')
    nays = models.ManyToManyField(Character, related_name='nay_votes')
    pres = models.ManyToManyField(Character, related_name='pres_votes')

class Leadership(models.Model):
    # use Character.id as fields
    potus = CharacterIdField(null=True)
    vpotus = CharacterIdField(null=True)
    speaker = CharacterIdField(null=True)
    majorityleader = CharacterIdField(null=True)
    majoritywhip = CharacterIdField(null=True)
    minoirtyleader = CharacterIdField(null=True)
    minoritywhip = CharacterIdField(null=True)
