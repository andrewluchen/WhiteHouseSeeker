from django.contrib.auth.models import User, Group

from machina.core.db.models import get_model

from usgs import models

ALL = 'Everyone'
DEMOCRATS = 'Democrats'
REPUBLICANS = 'Republicans'

def create_group_forum_permissions(group, forum):
    GroupForumPermission = get_model('forum_permission', 'GroupForumPermission')
    ForumPermission = get_model('forum_permission', 'ForumPermission')
    codenames = [
        'can_see_forum',
        'can_read_forum',
        'can_start_new_topics',
        'can_reply_to_topics',
        'can_edit_own_posts',
        'can_post_without_approval',
        'can_create_polls',
        'can_vote_in_polls',
        'can_attach_file',
        'can_download_file',
    ]
    for codename in codenames:
        GroupForumPermission.objects.create(
            group=group,
            forum=forum,
            permission=ForumPermission.objects.get(codename=codename)
        )

INITIAL_SEATS = [
    ['AL', 2, 'Republican'],
    ['AL', 3, 'Republican'],
    ['AK', 2, 'Republican'],
    ['AK', 3, 'Republican'],
    ['AZ', 1, 'Republican'],
    ['AZ', 3, 'Republican'],
    ['AR', 2, 'Republican'],
    ['AR', 3, 'Republican'],
    ['CA', 1, 'Democratic'],
    ['CA', 3, 'Democratic'],
    ['CO', 2, 'Republican'],
    ['CO', 3, 'Democratic'],
    ['CT', 1, 'Democratic'],
    ['CT', 3, 'Democratic'],
    ['DE', 1, 'Democratic'],
    ['DE', 2, 'Democratic'],
    ['FL', 1, 'Democratic'],
    ['FL', 3, 'Republican'],
    ['GA', 2, 'Republican'],
    ['GA', 3, 'Republican'],
    ['HI', 1, 'Democratic'],
    ['HI', 3, 'Democratic'],
    ['ID', 2, 'Republican'],
    ['ID', 3, 'Republican'],
    ['IL', 2, 'Democratic'],
    ['IL', 3, 'Democratic'],
    ['IN', 1, 'Democratic'],
    ['IN', 3, 'Republican'],
    ['IA', 2, 'Republican'],
    ['IA', 3, 'Republican'],
    ['KS', 2, 'Republican'],
    ['KS', 3, 'Republican'],
    ['KY', 2, 'Republican'],
    ['KY', 3, 'Republican'],
    ['LA', 2, 'Republican'],
    ['LA', 3, 'Republican'],
    ['ME', 1, 'Democratic'],
    ['ME', 2, 'Republican'],
    ['MD', 1, 'Democratic'],
    ['MD', 3, 'Democratic'],
    ['MA', 1, 'Democratic'],
    ['MA', 2, 'Democratic'],
    ['MI', 1, 'Democratic'],
    ['MI', 2, 'Democratic'],
    ['MN', 1, 'Democratic'],
    ['MN', 2, 'Democratic'],
    ['MS', 1, 'Republican'],
    ['MS', 2, 'Republican'],
    ['MO', 1, 'Democratic'],
    ['MO', 3, 'Republican'],
    ['MT', 1, 'Democratic'],
    ['MT', 2, 'Republican'],
    ['NE', 1, 'Republican'],
    ['NE', 2, 'Republican'],
    ['NV', 1, 'Republican'],
    ['NV', 3, 'Democratic'],
    ['NH', 2, 'Democratic'],
    ['NH', 3, 'Democratic'],
    ['NJ', 1, 'Democratic'],
    ['NJ', 2, 'Democratic'],
    ['NM', 1, 'Democratic'],
    ['NM', 2, 'Democratic'],
    ['NY', 1, 'Democratic'],
    ['NY', 3, 'Democratic'],
    ['NC', 2, 'Republican'],
    ['NC', 3, 'Republican'],
    ['ND', 1, 'Democratic'],
    ['ND', 3, 'Republican'],
    ['OH', 1, 'Democratic'],
    ['OH', 3, 'Republican'],
    ['OK', 2, 'Republican'],
    ['OK', 3, 'Republican'],
    ['OR', 2, 'Democratic'],
    ['OR', 3, 'Democratic'],
    ['PA', 1, 'Democratic'],
    ['PA', 3, 'Republican'],
    ['RI', 1, 'Democratic'],
    ['RI', 2, 'Democratic'],
    ['SC', 2, 'Republican'],
    ['SC', 3, 'Republican'],
    ['SD', 2, 'Republican'],
    ['SD', 3, 'Republican'],
    ['TN', 1, 'Republican'],
    ['TN', 2, 'Republican'],
    ['TX', 1, 'Republican'],
    ['TX', 2, 'Republican'],
    ['UT', 1, 'Republican'],
    ['UT', 3, 'Republican'],
    ['VT', 1, 'Democratic'],
    ['VT', 3, 'Democratic'],
    ['VA', 1, 'Democratic'],
    ['VA', 2, 'Democratic'],
    ['WA', 1, 'Democratic'],
    ['WA', 3, 'Democratic'],
    ['WV', 1, 'Democratic'],
    ['WV', 2, 'Republican'],
    ['WI', 1, 'Democratic'],
    ['WI', 3, 'Republican'],
    ['WY', 1, 'Republican'],
    ['WY', 2, 'Republican'],
]

def create_initial_seats():
    for seat in INITIAL_SEATS:
        s = models.SenateSeat(state=seat[0], senate_class=seat[1], party=seat[2])
        s.save()

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
    Forum = get_model('forum', 'Forum')
    if (not Group.objects.filter(name=ALL)):
        Group.objects.create(name=ALL)
        democrats = Group.objects.create(name=DEMOCRATS)
        republicans = Group.objects.create(name=REPUBLICANS)
        warrooms = Forum.objects.create(name='Party Warroom', type=1)
        dnc = Forum.objects.create(name='DNC Warroom', parent=warrooms, type=0)
        rnc = Forum.objects.create(name='RNC Warroom', parent=warrooms, type=0)
        create_group_forum_permissions(democrats, dnc)
        create_group_forum_permissions(republicans, rnc)
    everyone = Group.objects.get(name=ALL)
    if (not Forum.objects.filter(name='General Discussion')):
        gd = Forum.objects.create(name='General Discussion', type=0)
        mini = Forum.objects.create(name='Minigames', type=0)
        create_group_forum_permissions(everyone, gd)
        create_group_forum_permissions(everyone, mini)
    if (models.Seat.objects.count() == 0):
        create_initial_seats()


def is_admin(user):
    return False

def validate_character(user, character):
    assert(user.id == character.player.id)

def validate_bill_version(bill, billversion):
    assert(bill.id == billversion.bill.id)

def get_legislative_body(chamber):
    chamber = models.LegislativeBody.objects.get(name=chamber)
    return chamber
