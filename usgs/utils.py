from django.contrib.auth.models import User, Group

from usgs import models

DEMOCRATS = 'Democrats'
REPUBLICANS = 'Republicans'

def initialize():
    # check initialized
    if models.LegislativeBody.objects.filter(name='senate'):
        return
    # do initialize
    Group.objects.create(name=DEMOCRATS)
    Group.objects.create(name=REPUBLICANS)
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

def validate_character(user, character_id):
    character = models.Character.objects.get(pk=character_id)
    return user.id == character.player.id

def get_leg_body(chamber):
    chamber = models.LegislativeBody.objects.get(name=chamber)
    return chamber

def is_admin(user):
    return False
