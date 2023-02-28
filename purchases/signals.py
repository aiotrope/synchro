from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
from django.contrib.auth import get_user_model

from items.models import Item
from purchases.models import Purchase

User = get_user_model()


def update_stock(sender, instance, **kwargs):
    item_instance = Item.objects.filter(
        id=instance.purchases.item.id).update(on_stock='Sold Out')


post_save.connect(update_stock, sender=Purchase)


default_sender = getattr(settings, 'DEFAULT_FROM_EMAIL')


@receiver(post_save, sender=Purchase)
def send_mail_to_buyer(sender, instance, created, **kwargs):
    if created:

        obj = Purchase.objects.filter(buyer=instance.buyer)

        buyer_email = User.objects.get(id=instance.buyer).email
        buyer_username = User.objects.get(id=instance.buyer).username

        html_content = render_to_string('mensahe/buyer.html', {
            'username': buyer_username,
            'email': buyer_email,
            'items': obj
        })

        text_content = strip_tags(html_content)
        subject_buyer = 'Synchro - Purchase Notification'
        msg_buyer = EmailMultiAlternatives(
            subject_buyer, text_content, default_sender, [buyer_email])
        msg_buyer.attach_alternative(html_content, "text/html")
        msg_buyer.send()


@receiver(post_save, sender=Purchase)
def send_mail_to_sellers(sender, instance, created, **kwargs):
    if created:

        obj = Purchase.objects.filter(seller=instance.seller)
        seller_email = User.objects.get(id=instance.seller).email
        seller_username = User.objects.get(id=instance.seller).username

        html_content = render_to_string('mensahe/seller.html', {
            'username': seller_username,
            'email': seller_email,
            'items': obj
        })

        text_content = strip_tags(html_content)
        subject_seller = 'Synchro - Notification of Sale'
        msg_seller = EmailMultiAlternatives(
            subject_seller, text_content, default_sender, [seller_email])
        msg_seller.attach_alternative(html_content, "text/html")
        msg_seller.send()
