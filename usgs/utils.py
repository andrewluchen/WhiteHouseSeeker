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
    GroupForumPermission = get_model('forum_permission', 'GroupForumPermission')
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


def is_admin(user):
    return False

def validate_character(user, character):
    assert(user.id == character.player.id)

def validate_bill_version(bill, billversion):
    assert(bill.id == billversion.bill.id)

def get_legislative_body(chamber):
    chamber = models.LegislativeBody.objects.get(name=chamber)
    return chamber
