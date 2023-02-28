from django.db import models
from django.utils import timezone
from django_userforeignkey.models.fields import UserForeignKey


class Item(models.Model):
    name = models.CharField(max_length=90)
    description = models.TextField()
    price_entry = models.DecimalField(
        max_digits=14, decimal_places=2, default=0.00)
    merchant = UserForeignKey(auto_user_add=True,
                              verbose_name='item_creator', related_name='user_items')
    item_image = models.URLField(
        max_length=255, default='https://via.placeholder.com/150/81a4cd/FFFFFF/?text=ITEM', blank=True)
    on_stock = models.CharField(max_length=13, default='Available')
    created = models.DateTimeField(default=timezone.now)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created']

    def __str__(self):
        return '{}'.format(self.name)
