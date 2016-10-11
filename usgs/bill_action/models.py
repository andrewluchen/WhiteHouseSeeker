from django.db import models

from usgs.bill.models import BillVersion
from usgs.chamber.models import LegislativeBody
from usgs.character.models import Character


class Debate(models.Model):
    subject = models.ForeignKey(BillVersion, related_name='debates')
    starttime = models.DateTimeField()
    endtime = models.DateTimeField(null=True)
    location = models.ForeignKey(LegislativeBody, related_name='debates')

    def __unicode__(self):
        return self.subject.description

    def __str__(self):
        return self.__unicode__()


class Motion(models.Model):

    # no second
    UNANIMOUS = 'unanimous'
    # second
    AMEND = 'amend'
    CLOTURE = 'cloture'
    REFER = 'refer'
    TABLE = 'table'

    actor = models.ForeignKey(Character, related_name='+')
    debate = models.ForeignKey(Debate, related_name='motions')
    motion_type = models.CharField(max_length=80)
    seconded = models.BooleanField(default=False, blank=True)
    amendment = models.TextField(null=True, blank=True)
    starttime = models.DateTimeField(null=True, blank=True)
    endtime = models.DateTimeField(null=True, blank=True)
    yeas = models.ManyToManyField(Character, related_name='+', blank=True)
    nays = models.ManyToManyField(Character, related_name='+', blank=True)
    pres = models.ManyToManyField(Character, related_name='+', blank=True)


class Vote(models.Model):
    subject = models.ForeignKey(BillVersion, related_name='votes')
    starttime = models.DateTimeField()
    endtime = models.DateTimeField()
    location = models.ForeignKey(LegislativeBody, related_name='votes')
    yeas = models.ManyToManyField(Character, related_name='yea_votes', blank=True)
    nays = models.ManyToManyField(Character, related_name='nay_votes', blank=True)
    pres = models.ManyToManyField(Character, related_name='pres_votes', blank=True)

    def __unicode__(self):
        return self.subject.description

    def __str__(self):
        return self.__unicode__()
