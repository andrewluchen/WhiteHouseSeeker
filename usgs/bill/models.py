from datetime import datetime

from django.contrib.auth.models import User
from django.db import models

from usgs.chamber.models import LegislativeBody
from usgs.character.models import Character


class Bill(models.Model):
    title = models.TextField()
    sponsor = models.ForeignKey(Character, related_name='sponsored_bills')
    cosponsors = models.ManyToManyField(Character, related_name='cosponsored_bills', blank=True)

    def __unicode__(self):
        return (
            'S.' + str(self.id) + ' ' + self.title
        )

    def __str__(self):
        return self.__unicode__()

    description = property(__str__)

    class Meta:
        verbose_name = 'Bill Summary'
        verbose_name_plural = 'Bill Summaries'


class BillVersion(models.Model):
    BILL_CLERK = 'Introduced'
    BILL_DEBATE = 'In Debate'
    BILL_VOTE = 'In Vote'
    BILL_PASS = 'Passed'
    BILL_FAIL = 'Failed'
    BILL_POTUS = 'Presented to the President'
    BILL_SIGN = 'Sign into Law'
    BILL_VETO = 'Vetoed by the President'
    BILL_OVERRIDE = 'Passed over veto'

    bill = models.ForeignKey(Bill, related_name='versions')
    status = models.CharField(max_length=100)
    closed = models.BooleanField(default=False, blank=True)
    body = models.TextField()
    modified = models.DateTimeField()
    location = models.ForeignKey(LegislativeBody, related_name='bills')

    def __unicode__(self):
        return (
            'S.' + str(self.bill.id) + ' ' + self.bill.title + ' - (rev.' + str(self.id) +')'
        )

    def __str__(self):
        return self.__unicode__()

    description = property(__str__)

    class Meta:
        verbose_name = 'Bill Version'
        verbose_name_plural = 'Bill Versions'


class Debate(models.Model):
    subject = models.ForeignKey(BillVersion, related_name='debates')
    starttime = models.DateTimeField()
    endtime = models.DateTimeField()
    location = models.ForeignKey(LegislativeBody, related_name='debates')


class Vote(models.Model):
    subject = models.ForeignKey(BillVersion, related_name='votes')
    starttime = models.DateTimeField()
    endtime = models.DateTimeField()
    location = models.ForeignKey(LegislativeBody, related_name='votes')
    yeas = models.ManyToManyField(Character, related_name='yea_votes', blank=True)
    nays = models.ManyToManyField(Character, related_name='nay_votes', blank=True)
    pres = models.ManyToManyField(Character, related_name='pres_votes', blank=True)
