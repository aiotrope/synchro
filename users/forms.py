from django.contrib.auth import forms, get_user_model
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

from django.forms import (
    CharField,
    EmailField,
    TextInput,
    EmailInput,
)

User = get_user_model()


class UserChangeForm(forms.UserChangeForm):
    username = CharField(required=True, widget=TextInput)
    email = EmailField(required=True, widget=EmailInput)
    first_name = CharField(widget=TextInput)
    last_name = CharField(widget=TextInput)

    class Meta(forms.UserChangeForm.Meta):
        model = User
        fields = '__all__'


class UserCreationForm(forms.UserCreationForm):
    error_message = forms.UserCreationForm.error_messages.update(
        {"duplicate_username": _("This username has already been taken.")}
    )

    class Meta(forms.UserCreationForm.Meta):
        model = User
        fields = '__all__'

    def clean_username(self):
        username = self.cleaned_data['username']

        try:
            User.objects.get(username=username)
        except User.DoesNotExist:
            return username

        raise ValidationError(self.error_messages['duplicate_username'])