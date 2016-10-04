from django.contrib.auth.models import User, Group

from usgs import models

DEMOCRATS = 'Democrats'
REPUBLICANS = 'Republicans'

def initialize():
    # check initialized
    if Group.objects.filter(name=DEMOCRATS):
        return
    # do initialize
    Group.objects.create(name=DEMOCRATS)
    Group.objects.create(name=REPUBLICANS)
    bodies = [
        'library',
        'potus_desk',
        'senate',
        'house',
        'concomm',
        'graveyard',
    ]
    for body in bodies:
        b = models.LegislativeBody(name=body)
        b.save()

def get_leg_body(chamber):
    chamber = models.LegislativeBody.objects.get(name=chamber).first()
    return chamber

def is_admin(user):
    return False

def validate_character(user, character_id):
    character = models.Character.objects.get(pk=character_id)
    return user.id == character.user.id
