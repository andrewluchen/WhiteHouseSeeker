# -*- coding: utf-8 -*-
# Generated by Django 1.9.10 on 2017-01-07 21:54
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Article',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('body', models.TextField()),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='+', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Bill',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.TextField()),
            ],
            options={
                'verbose_name': 'Bill Summary',
                'verbose_name_plural': 'Bill Summaries',
            },
        ),
        migrations.CreateModel(
            name='BillVersion',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(max_length=100)),
                ('closed', models.BooleanField(default=False)),
                ('body', models.TextField()),
                ('modified', models.DateTimeField()),
                ('bill', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='versions', to='usgs.Bill')),
            ],
            options={
                'verbose_name': 'Bill Version',
                'verbose_name_plural': 'Bill Versions',
            },
        ),
        migrations.CreateModel(
            name='Campaign',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.CharField(max_length=140)),
                ('platform', models.TextField(blank=True, default=b'')),
                ('withdrawn', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='CampaignDay',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('body', models.TextField()),
                ('costs', models.IntegerField(blank=True, default=0)),
                ('timestamp', models.DateTimeField(auto_now=True)),
                ('campaign', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='days', to='usgs.Campaign')),
            ],
        ),
        migrations.CreateModel(
            name='Debate',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('active', models.BooleanField(default=True)),
                ('starttime', models.DateTimeField()),
                ('endtime', models.DateTimeField(null=True)),
            ],
        ),
        migrations.CreateModel(
            name='DebateComment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('comment', models.TextField()),
                ('timestamp', models.DateTimeField()),
                ('debate', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='comments', to='usgs.Debate')),
            ],
            options={
                'verbose_name': 'Bill Comment',
                'verbose_name_plural': 'Bill Comments',
            },
        ),
        migrations.CreateModel(
            name='DebateMotion',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('motion_type', models.CharField(max_length=80)),
                ('amendment', models.TextField(blank=True, null=True)),
                ('active', models.BooleanField(default=True)),
                ('starttime', models.DateTimeField(blank=True, null=True)),
                ('endtime', models.DateTimeField(blank=True, null=True)),
                ('debate', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='motions', to='usgs.Debate')),
            ],
            options={
                'verbose_name': 'Bill Motion',
                'verbose_name_plural': 'Bill Motions',
            },
        ),
        migrations.CreateModel(
            name='Election',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.TextField()),
                ('year', models.IntegerField()),
                ('can_file', models.BooleanField(default=True)),
            ],
        ),
        migrations.CreateModel(
            name='ElectionCharacter',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=80)),
                ('party', models.CharField(max_length=80)),
            ],
        ),
        migrations.CreateModel(
            name='ElectionDay',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('primary', models.BooleanField(default=False)),
                ('day', models.IntegerField()),
                ('comments', models.TextField()),
                ('revealed', models.BooleanField(default=False)),
                ('election', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='days', to='usgs.Election')),
            ],
        ),
        migrations.CreateModel(
            name='Fundraiser',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('body', models.TextField()),
                ('timestamp', models.DateTimeField(blank=True, default=django.utils.timezone.now)),
                ('campaign', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='fundraisers', to='usgs.Campaign')),
            ],
        ),
        migrations.CreateModel(
            name='Holding',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(blank=True, default=b'', max_length=80)),
                ('subtitle', models.CharField(blank=True, default=b'', max_length=80)),
                ('partytitle', models.CharField(blank=True, default=b'', max_length=80)),
                ('starttime', models.DateTimeField(default=django.utils.timezone.now)),
                ('endtime', models.DateTimeField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='LegislativeBody',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=80, unique=True)),
                ('parent', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='children', to='usgs.LegislativeBody')),
            ],
        ),
        migrations.CreateModel(
            name='NewsNetwork',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_admin', models.BooleanField(default=False)),
                ('title', models.CharField(max_length=200)),
                ('body', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='Seat',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
        ),
        migrations.CreateModel(
            name='Transaction',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.IntegerField()),
                ('description', models.CharField(max_length=140)),
                ('timestamp', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='Tweet',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('handle', models.CharField(max_length=80)),
                ('tweet', models.CharField(max_length=200)),
                ('hashtags', models.CharField(max_length=200)),
                ('created', models.DateTimeField(auto_now=True)),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='+', to=settings.AUTH_USER_MODEL)),
                ('downs', models.ManyToManyField(blank=True, related_name='_tweet_downs_+', to=settings.AUTH_USER_MODEL)),
                ('ups', models.ManyToManyField(blank=True, related_name='_tweet_ups_+', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Vote',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('active', models.BooleanField(default=True)),
                ('starttime', models.DateTimeField()),
                ('endtime', models.DateTimeField()),
                ('location', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='votes', to='usgs.LegislativeBody')),
                ('subject', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='votes', to='usgs.BillVersion')),
            ],
        ),
        migrations.CreateModel(
            name='Warchest',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
        ),
        migrations.CreateModel(
            name='Character',
            fields=[
                ('electioncharacter_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='usgs.ElectionCharacter')),
                ('primary', models.BooleanField()),
                ('activated', models.DateTimeField(default=django.utils.timezone.now)),
                ('deactivated', models.DateTimeField(blank=True, null=True)),
                ('birthday', models.DateField()),
                ('gender', models.CharField(max_length=1)),
                ('residence', models.CharField(blank=True, default=b'', max_length=80)),
                ('state', models.CharField(max_length=2)),
                ('avatar', models.TextField(blank=True, default=b'')),
                ('bio', models.TextField(blank=True, default=b'')),
                ('player', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='characters', to=settings.AUTH_USER_MODEL)),
            ],
            bases=('usgs.electioncharacter',),
        ),
        migrations.CreateModel(
            name='SenateSeat',
            fields=[
                ('seat_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='usgs.Seat')),
                ('state', models.CharField(max_length=2)),
                ('senate_class', models.IntegerField()),
                ('party', models.CharField(max_length=80)),
            ],
            bases=('usgs.seat',),
        ),
        migrations.AddField(
            model_name='warchest',
            name='character',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='warchest', to='usgs.ElectionCharacter'),
        ),
        migrations.AddField(
            model_name='transaction',
            name='receiver',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='incoming', to='usgs.Warchest'),
        ),
        migrations.AddField(
            model_name='transaction',
            name='sender',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='outgoing', to='usgs.Warchest'),
        ),
        migrations.AddField(
            model_name='seat',
            name='holder',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='+', to='usgs.ElectionCharacter'),
        ),
        migrations.AddField(
            model_name='fundraiser',
            name='transaction',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='+', to='usgs.Transaction'),
        ),
        migrations.AddField(
            model_name='election',
            name='winner',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='+', to='usgs.ElectionCharacter'),
        ),
        migrations.AddField(
            model_name='debate',
            name='location',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='debates', to='usgs.LegislativeBody'),
        ),
        migrations.AddField(
            model_name='debate',
            name='subject',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='debates', to='usgs.BillVersion'),
        ),
        migrations.AddField(
            model_name='campaignday',
            name='day',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='campaigns', to='usgs.ElectionDay'),
        ),
        migrations.AddField(
            model_name='campaign',
            name='candidate',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='campaigns', to='usgs.ElectionCharacter'),
        ),
        migrations.AddField(
            model_name='campaign',
            name='election',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='campaigns', to='usgs.Election'),
        ),
        migrations.AddField(
            model_name='billversion',
            name='location',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='bills', to='usgs.LegislativeBody'),
        ),
        migrations.AddField(
            model_name='vote',
            name='nays',
            field=models.ManyToManyField(blank=True, related_name='nay_votes', to='usgs.Character'),
        ),
        migrations.AddField(
            model_name='vote',
            name='pres',
            field=models.ManyToManyField(blank=True, related_name='pres_votes', to='usgs.Character'),
        ),
        migrations.AddField(
            model_name='vote',
            name='yeas',
            field=models.ManyToManyField(blank=True, related_name='yea_votes', to='usgs.Character'),
        ),
        migrations.AddField(
            model_name='holding',
            name='holder',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='holdings', to='usgs.Character'),
        ),
        migrations.AddField(
            model_name='debatemotion',
            name='actor',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='+', to='usgs.Character'),
        ),
        migrations.AddField(
            model_name='debatemotion',
            name='nays',
            field=models.ManyToManyField(blank=True, related_name='_debatemotion_nays_+', to='usgs.Character'),
        ),
        migrations.AddField(
            model_name='debatemotion',
            name='pres',
            field=models.ManyToManyField(blank=True, related_name='_debatemotion_pres_+', to='usgs.Character'),
        ),
        migrations.AddField(
            model_name='debatemotion',
            name='seconded',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='+', to='usgs.Character'),
        ),
        migrations.AddField(
            model_name='debatemotion',
            name='yeas',
            field=models.ManyToManyField(blank=True, related_name='_debatemotion_yeas_+', to='usgs.Character'),
        ),
        migrations.AddField(
            model_name='debatecomment',
            name='actor',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='comments', to='usgs.Character'),
        ),
        migrations.AddField(
            model_name='bill',
            name='cosponsors',
            field=models.ManyToManyField(blank=True, related_name='cosponsored_bills', to='usgs.Character'),
        ),
        migrations.AddField(
            model_name='bill',
            name='sponsor',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sponsored_bills', to='usgs.Character'),
        ),
    ]
