from django.db import models
from django.utils import timezone
# from django_userforeignkey.models.fields import UserForeignKey

from carts.models import Cart


class Purchase(models.Model):
    purchases = models.ForeignKey(
        Cart, on_delete=models.CASCADE, related_name='purchases')
    buyer = models.PositiveBigIntegerField(blank=True, null=True)
    seller = models.PositiveBigIntegerField(blank=True, null=True)
    created = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['-created']

    def __str__(self):
        return '{}'.format(self.purchases)

    def save(self, *args, **kwargs):
        self.seller = self.purchases.merchant
        self.customer = self.purchases.customer
        super(Purchase, self).save(*args, **kwargs)
