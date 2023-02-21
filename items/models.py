from django.db import models
from django.utils import timezone
from django_userforeignkey.models.fields import UserForeignKey
import babel.numbers
import locale

locale.setlocale(locale.LC_ALL, 'fi_FI')
grouping = True


class Item(models.Model):
    name = models.CharField(max_length=90)
    slug = models.SlugField(max_length=255, editable=False)
    description = models.TextField()
    price_entry = models.DecimalField(
        max_digits=14, decimal_places=2, default=0.00)
    price = models.CharField(max_length=20, blank=True)
    currency = models.CharField(max_length=20, blank=True)
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

    def save(self, *args, **kwargs):
        money = locale.currency(
            self.price_entry, symbol=True, grouping=True, international=True)
        formatted = locale.currency(
            self.price_entry, symbol=False, grouping=True)
        self.currency = money
        self.price = formatted
        return super().save(*args, **kwargs)
