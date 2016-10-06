from django.contrib.auth.models import User
from django.db import models


class LegislativeBody(models.Model):
    name = models.CharField(max_length=80, unique=True)
    parent = models.ForeignKey('self', related_name='children', null=True, blank=True)

    def __unicode__(self):
        return self.name

    def __str__(self):
        return self.__unicode__()
