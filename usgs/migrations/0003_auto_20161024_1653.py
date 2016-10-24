# -*- coding: utf-8 -*-
# Generated by Django 1.9.10 on 2016-10-24 16:53
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('usgs', '0002_auto_20161024_0348'),
    ]

    operations = [
        migrations.AddField(
            model_name='campaign',
            name='withdrawn',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='transaction',
            name='description',
            field=models.CharField(default=0, max_length=80),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='election',
            name='started',
            field=models.BooleanField(default=False),
        ),
    ]
