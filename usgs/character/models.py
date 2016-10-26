from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone

# for DNC, RNC, party warchests etc.
class ElectionCharacter(models.Model):
    name = models.CharField(max_length=80)
    party = models.CharField(max_length=80)

    def __unicode__(self):
        return self.name

    def __str__(self):
        return self.__unicode__()


class Character(ElectionCharacter):
    player = models.ForeignKey(User, related_name='characters')
    primary = models.BooleanField()
    activated = models.DateTimeField(default=timezone.now)
    deactivated = models.DateTimeField(null=True, blank=True)

    birthday = models.DateField()
    gender = models.CharField(max_length=1)
    residence = models.CharField(max_length=80)
    state = models.CharField(max_length=2)
    avatar = models.TextField(default='', blank=True)
    bio = models.TextField(default='', blank=True)

    def short(self):
        return self.name + ' ' + '(' + self.party[0] + '-' + self.state + ')'

    def get_title(self):
        holds = Holding.objects.filter(holder=self, endtime__isnull=True)
        if (holds.count() != 0):
            return holds.first().title
        return None

    def __unicode__(self):
        title = self.get_title()
        if (not title):
            title = 'Private Citizen'
        return title + ' ' + self.short()

    def __str__(self):
        return self.__unicode__()

    short_description = property(short)
    description = property(__str__)


class Holding(models.Model):

    # Main titles
    POTUS = 'President'
    VPOTUS = 'Vice President'
    SENATOR = 'Senator'
    REPRESENTATIVE = 'Representative'
    GOVERNOR = 'Governor'

    # Secondary titles
    SML = 'Senate Majority Leader'
    SML2 = 'Senate Majority Whip'
    SmL = 'Senate Minority Leader'
    SmL2 = 'Senate Minority Whip'
    SPEAKER = 'Speaker'
    HML = 'House Majority Leader'
    HML2 = 'House Majority Whip'
    HmL = 'House Minority Leader'
    HmL2 = 'House Minority Whip'

    # ???
    DNC = 'Democratic Chair'
    DNC2 = 'Democratic Vice Chair'
    RNC = 'Republican Chair'
    RNC2 = 'Republican Vice Chair'

    holder = models.ForeignKey(Character, related_name='holdings')
    title = models.CharField(max_length=80)
    subtitle = models.CharField(max_length=80, default='', blank=True)
    partytitle = models.CharField(max_length=80, default='', blank=True)
    starttime = models.DateTimeField(default=timezone.now)
    endtime = models.DateTimeField(null=True, blank=True)

    def __unicode__(self):
        return self.title

    def __str__(self):
        return self.__unicode__()
