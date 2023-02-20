from django.db import models
from django.utils import timezone
from django_userforeignkey.models.fields import UserForeignKey
from djmoney.models.fields import MoneyField


class Item(models.Model):
    name = models.CharField(max_length=80)
    slug = models.SlugField(max_length=255, unique=True, editable=False)
    description = models.TextField()
    price = MoneyField(max_digits=14, decimal_places=2, default_currency='EUR')
    merchant = UserForeignKey(auto_user_add=True,
                              verbose_name='item_creator', related_name='user_items')
    item_image = models.URLField(
        max_length=255, default='https://via.placeholder.com/150/81a4cd/FFFFFF/?text=ITEM', blank=True)
    on_stock = models.BooleanField(default=True)
    created = models.DateTimeField(default=timezone.now)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created']

    def __str__(self):
        return '{}'.format(self.name)
