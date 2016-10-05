from django.contrib.auth.models import User
from django.db import models


class LegislativeBody(models.Model):
    name = models.CharField(max_length=80, unique=True)
    parent = models.ForeignKey('self', related_name='children', null=True, blank=True)
