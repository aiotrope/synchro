from django.contrib import admin
from .models import Purchase


@admin.register(Purchase)
class PurchaseAdmin(admin.ModelAdmin):
    pass

    """ def save_model(self, request, obj, form, change):
        obj.buyer = request.user
        super().save_model(request, obj, form, change)
 """
