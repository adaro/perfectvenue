# -*- coding: utf-8 -*-
# Generated by Django 1.11.16 on 2018-11-29 04:53
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pv_api', '0011_auto_20181129_0420'),
    ]

    operations = [
        migrations.AddField(
            model_name='venue',
            name='photo',
            field=models.URLField(blank=True, null=True),
        ),
    ]