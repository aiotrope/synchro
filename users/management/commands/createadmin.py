from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from decouple import config


User = get_user_model()


class Command(BaseCommand):
    help = 'Create superuser'

    def handle(self, *args, **options):
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser(
                username=config('SU_USERNAME'),
                email=config('SU_EMAIL'),
                password=config('SU_PASSWORD'),
                is_staff=True,
                is_active=True,
                is_superuser=True
            )
