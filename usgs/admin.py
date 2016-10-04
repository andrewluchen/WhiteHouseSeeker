from django.contrib import admin

from usgs import models

class CharacterAdmin(admin.ModelAdmin):
    list_display = ('player', 'name')

admin.site.register(models.Character, CharacterAdmin)
