# -*- coding: utf-8 -*-
# Generated by Django 1.11.16 on 2018-11-27 18:54
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pv_api', '0005_auto_20181127_0040'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='space',
            name='venue',
        ),
        migrations.AddField(
            model_name='venue',
            name='spaces',
            field=models.ManyToManyField(to='pv_api.Space'),
        ),
    ]
