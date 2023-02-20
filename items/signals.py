from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.utils.text import slugify

from core.utils import generate_random_string
from items.models import Items


# Generate unique slug
@receiver(pre_save, sender=Items)
def add_slug_to_category(sender, instance, *args, **kwargs):
    if instance and not instance.slug:
        slug = slugify(instance.name)
        random_string = generate_random_string()
        instance.slug = slug + "-" + random_string
