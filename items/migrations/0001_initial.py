# Generated by Django 3.2 on 2023-02-21 01:51

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import django_userforeignkey.models.fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Item',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=90)),
                ('slug', models.SlugField(editable=False, max_length=255)),
                ('description', models.TextField()),
                ('price_entry', models.DecimalField(decimal_places=2, default=0.0, max_digits=14)),
                ('price', models.CharField(max_length=20)),
                ('item_image', models.URLField(blank=True, default='https://via.placeholder.com/150/81a4cd/FFFFFF/?text=ITEM', max_length=255)),
                ('on_stock', models.BooleanField(default=True)),
                ('created', models.DateTimeField(default=django.utils.timezone.now)),
                ('updated', models.DateTimeField(auto_now=True)),
                ('merchant', django_userforeignkey.models.fields.UserForeignKey(blank=True, editable=False, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='user_items', to=settings.AUTH_USER_MODEL, verbose_name='item_creator')),
            ],
            options={
                'ordering': ['-created'],
            },
        ),
    ]
