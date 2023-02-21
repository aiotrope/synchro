from django.contrib.auth.models import AbstractUser
from django.db.models import CharField, EmailField, BooleanField
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.validators import UnicodeUsernameValidator
from django.core.validators import validate_email

from .managers import UserManager


class User(AbstractUser):
    validate_username = UnicodeUsernameValidator()

    username = CharField(_('username'), max_length=150, blank=False,
                         unique=True, validators=[validate_username])
    email = EmailField(_('email address'), unique=True,
                       blank=False, validators=[validate_email])
    fabricated = BooleanField(_('fabricated'), default=False)

    USERNAME_FIELD = 'username'
    
    EMAIL_FIELD = 'email'

    REQUIRED_FIELDS = ['email']

    objects = UserManager()

    def __str__(self):
        return self.get_full_name()

    def get_absolute_url(self):
        return reverse("users:detail", kwargs={'username': self.username})

    def get_full_name(self):
        return "{} {}".format(self.first_name, self.last_name)