# Generated by Django 3.2 on 2023-02-18 14:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='fabricated',
            field=models.BooleanField(default=False, verbose_name='fabricated'),
        ),
    ]
