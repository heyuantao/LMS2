# -*- coding: utf-8 -*-
# Generated by Django 1.10.4 on 2017-02-05 23:56
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('EXPS', '0007_auto_20170205_1930'),
    ]

    operations = [
        migrations.AddField(
            model_name='coursemodel',
            name='lab',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='EXPS.LabModel'),
        ),
    ]
