from django.contrib.auth.models import User, Group

from usgs import models

DEMOCRATS = 'Democrats'
REPUBLICANS = 'Republicans'

def initialize():
    if (not models.LegislativeBody.objects.filter(name='senate')):
        bodies = [
            'library',
            'potusdesk',
            'senate',
            'house',
            'concomm',
        ]
        for body in bodies:
            b = models.LegislativeBody(name=body)
            b.save()
    if (not Group.objects.filter(name=DEMOCRATS)):
        Group.objects.create(name=DEMOCRATS)
        Group.objects.create(name=REPUBLICANS)

def is_admin(user):
    return False

def validate_character(user, character):
    assert(user.id == character.player.id)

def validate_bill_version(bill, billversion):
    assert(bill.id == billversion.bill.id)

def get_legislative_body(chamber):
    chamber = models.LegislativeBody.objects.get(name=chamber)
    return chamber
