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
        starting_location = BillVersion.objects.filter(bill=self, status=BillVersion.BILL_CLERK).first().location
        prefix = 'S.' if starting_location.name == 'senate' else 'H.R.'
        return prefix + str(self.id) + ' ' + self.title

    def __str__(self):
        return self.__unicode__()

    description = property(__str__)

    class Meta:
        verbose_name = 'Bill Summary'
        verbose_name_plural = 'Bill Summaries'

'''
Every Version should either end in Signed/Failed or spawn an active version

(Senate) Introduced -> Inactive
(S.Comittee) Referred -> In Debate -> In Vote -> Passed/Failed -> Inactive
(Senate) Received -> In Debate -> In Vote -> Passed/Failed -> Inactive
(House) Received -> In Debate -> In Vote -> Passed/Failed -> Inactive
TODO: (ConCom) Received -> ???
(Potus) Presented to the President -> Signed/Vetoed -> Override/Failed -> Inactive
'''
class BillVersion(models.Model):
    BILL_CLERK = 'Introduced'
    BILL_DEBATE = 'In Debate'
    BILL_VOTE = 'In Vote'
    BILL_PASS = 'Passed'
    BILL_FAIL = 'Failed'
    BILL_REFER = 'Referred to Comittee'
    BILL_RECEIVE = 'Received for Floor Consideration'
    BILL_POTUS = 'Presented to the President'
    BILL_SIGN = 'Signed into Law'
    BILL_VETO = 'Vetoed by the President'
    BILL_OVERRIDE = 'Passed over Veto'

    bill = models.ForeignKey(Bill, related_name='versions')
    status = models.CharField(max_length=100)
    closed = models.BooleanField(default=False, blank=True)
    body = models.TextField()
    modified = models.DateTimeField()
    location = models.ForeignKey(LegislativeBody, related_name='bills')

    def __unicode__(self):
        return (
            str(self.bill.id) + ' ' + self.bill.title + ' - (id.' + str(self.id) +')'
        )

    def __str__(self):
        return self.__unicode__()

    description = property(__str__)

    class Meta:
        verbose_name = 'Bill Version'
        verbose_name_plural = 'Bill Versions'
