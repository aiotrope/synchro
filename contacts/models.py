from django.db import models
from django.conf import settings
from django.core.validators import MinLengthValidator, validate_email
from django.contrib.auth.validators import UnicodeUsernameValidator
from django_userforeignkey.models.fields import UserForeignKey
from django.utils import timezone

User = settings.AUTH_USER_MODEL
validate_username = UnicodeUsernameValidator()


class Contact(models.Model):
    user = UserForeignKey(auto_user_add=True,
                          verbose_name='messenger', related_name='contact')
    subject = models.CharField(validators=[MinLengthValidator(
        limit_value=4, message='Minimum of four characters are allowed')], max_length=255)
    emailInfo = models.EmailField(blank=False, validators=[validate_email])
    usernameInfo = models.CharField(
        blank=False, max_length=150, validators=[validate_username])
    messageBody = models.TextField()
    first_name = models.CharField(max_length=150, blank=True, default='')
    last_name = models.CharField(max_length=150, blank=True, default='')
    created = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['-created']

    def __str__(self):
        return 'Message from: {} - {}'.format(self.usernameInfo, self.emailInfo)
