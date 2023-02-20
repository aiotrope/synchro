from django.contrib import admin
from .models import Initial


@admin.register(Initial)
class InitialAdmin(admin.ModelAdmin):
    pass
