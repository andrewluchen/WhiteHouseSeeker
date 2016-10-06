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
