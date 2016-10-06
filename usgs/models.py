from django.contrib.auth.models import User
from django.db import models

from usgs.chamber.models import LegislativeBody
from usgs.character.models import Character
from usgs.bill.models import Bill, BillVersion, Debate, Vote


class Leadership(models.Model):
    potus = models.ForeignKey(Character, null=True, related_name='+')
    vpotus = models.ForeignKey(Character, null=True, related_name='+')
    speaker = models.ForeignKey(Character, null=True, related_name='+')
    majorityleader = models.ForeignKey(Character, null=True, related_name='+')
    majoritywhip = models.ForeignKey(Character, null=True, related_name='+')
    minoirtyleader = models.ForeignKey(Character, null=True, related_name='+')
    minoritywhip = models.ForeignKey(Character, null=True, related_name='+')
