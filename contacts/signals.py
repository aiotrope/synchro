from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail, EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings

from .models import Contact


aiotrope = getattr(settings, 'EMAIL_RECEIVER')
default_sender = getattr(settings, 'DEFAULT_FROM_EMAIL')


@receiver(post_save, sender=Contact)
def send_mail_on_create(sender, instance=None, created=False, **kwargs):
    if created:
        obj = Contact.objects.all().first()

        msg_for_aiotrope = '{}\n\n\nSender E-mail: {}\nSender Name: {} - {}'.format(
            obj.messageBody,
            obj.emailInfo,
            obj.usernameInfo,
            obj.first_name,
            obj.last_name,

        )
        send_mail(obj.subject, msg_for_aiotrope, default_sender,
                  [aiotrope], fail_silently=False)


@receiver(post_save, sender=Contact)
def send_to_sender_on_create(sender, instance=None, created=False, **kwargs):
    if created:
        obj = Contact.objects.all().first()
        default_sender = getattr(settings, 'DEFAULT_FROM_EMAIL')
        html_content = render_to_string('mensahe/copy.html', {
            'first_name': obj.first_name,
            'last_name': obj.last_name,
            'usernameInfo': obj.usernameInfo,
            'emailInfo': obj.emailInfo,
            'subject': obj.subject,
            'messageBody': obj.messageBody
        })

        text_content = strip_tags(html_content)
        sub_for_anon_sender = 'From Synchro Team'
        msg_anon_sender = EmailMultiAlternatives(
            sub_for_anon_sender, text_content, default_sender, [obj.emailInfo])
        msg_anon_sender.attach_alternative(html_content, "text/html")
        msg_anon_sender.send()
