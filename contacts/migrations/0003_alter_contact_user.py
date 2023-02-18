# Generated by Django 3.2 on 2023-02-17 18:05

from django.conf import settings
from django.db import migrations
import django.db.models.deletion
import django_userforeignkey.models.fields


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('contacts', '0002_alter_contact_usernameinfo'),
    ]

    operations = [
        migrations.AlterField(
            model_name='contact',
            name='user',
            field=django_userforeignkey.models.fields.UserForeignKey(blank=True, editable=False, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='contact', to=settings.AUTH_USER_MODEL, verbose_name='messenger'),
        ),
    ]