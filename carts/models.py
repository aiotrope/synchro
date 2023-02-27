from django.db import models
from django.utils import timezone
from django_userforeignkey.models.fields import UserForeignKey

from items.models import Item


class Cart(models.Model):
    item = models.ForeignKey(
        Item, on_delete=models.CASCADE, related_name='carts')
    customer = UserForeignKey(auto_user_add=True,
                              verbose_name='cart_creator', related_name='customers')
    item_price_entry = models.DecimalField(max_digits=14, decimal_places=2, default=0.00)
    merchant = models.PositiveBigIntegerField(blank=True, null=True)
    merchant_email = models.EmailField(blank=True)
    customer_email = models.EmailField(blank=True)
    created = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['-created']

    def __str__(self):
        return '{}'.format(self.item)

    def save(self, *args, **kwargs):
        self.item_price_entry = self.item.price_entry
        self.merchant = self.item.merchant.id
        self.merchant_email = self.item.merchant.email

        super(Cart, self).save(*args, **kwargs)
