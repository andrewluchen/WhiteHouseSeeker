from django.contrib import admin

from usgs import models

class CharacterAdmin(admin.ModelAdmin):
    list_display = ('player', 'name',)

class BillAdmin(admin.ModelAdmin):
    filter_horizontal = ('cosponsors',)

class VoteAdmin(admin.ModelAdmin):
    filter_horizontal = ('yeas', 'nays', 'pres',)

admin.site.register(models.Character, CharacterAdmin)
admin.site.register(models.Bill, BillAdmin)
admin.site.register(models.BillVersion)
admin.site.register(models.Vote, VoteAdmin)
admin.site.register(models.Debate)
admin.site.register(models.DebateMotion)
admin.site.register(models.Transaction)
admin.site.register(models.Election)
admin.site.register(models.Campaign)



from machina.core.db.models import get_model
''''
machina/apps/forum_permission/admin.py:admin.site.register(ForumPermission, ForumPermissionAdmin)
machina/apps/forum_permission/admin.py:admin.site.register(GroupForumPermission, GroupForumPermissionAdmin)
machina/apps/forum_permission/admin.py:admin.site.register(UserForumPermission, UserForumPermissionAdmin)
machina/apps/forum_member/admin.py:admin.site.register(ForumProfile, ForumProfileAdmin)
'''

Topic = get_model('forum_conversation', 'Topic')
Post = get_model('forum_conversation', 'Post')
TopicPoll = get_model('forum_polls', 'TopicPoll')
TopicPollOption = get_model('forum_polls', 'TopicPollOption')
TopicPollVote = get_model('forum_polls', 'TopicPollVote')
Attachment = get_model('forum_attachments', 'Attachment')
ForumPermission = get_model('forum_permission', 'ForumPermission')
ForumReadTrack = get_model('forum_tracking', 'ForumReadTrack')
TopicReadTrack = get_model('forum_tracking', 'TopicReadTrack')

admin.site.unregister(Topic)
admin.site.unregister(Post)
admin.site.unregister(TopicPoll)
admin.site.unregister(TopicPollOption)
admin.site.unregister(TopicPollVote)
admin.site.unregister(Attachment)
admin.site.unregister(ForumPermission)
admin.site.unregister(ForumReadTrack)
admin.site.unregister(TopicReadTrack)
