# -*- coding: utf-8 -*-
# Generated by Django 1.11.16 on 2018-11-29 04:20
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pv_api', '0010_event_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='space',
            name='description',
            field=models.TextField(default=''),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='space',
            name='photo',
            field=models.URLField(blank=True, null=True),
        ),
    ]
