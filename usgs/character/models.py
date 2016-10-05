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

    def __unicode__(self):
        title = self.title if self.title else 'Private Citizen'
        return (
            title + ' ' + self.name + ' ' + '(' + self.party[0] + '-' + self.state + ')'
        )

    def __str__(self):
        return self.__unicode__()

    description = property(__str__)
