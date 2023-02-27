from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

from carts.models import Cart
from items.models import Item


@receiver(post_save, sender=Cart)
def update_item_stock_false(sender, instance, created, **kwargs):

    if created:
        itemObj = Item.objects.get(id=instance.item.id)
        itemObj.on_stock = 'On Hold'
        itemObj.save()

@receiver(post_delete, sender=Cart)
def update_item_stock_true(sender, instance, **kwargs):
    itemObj = Item.objects.get(id=instance.item.id)
    itemObj.on_stock = 'Available'
    itemObj.save()
