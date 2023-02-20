from django.db import models
from django.utils import timezone


class Initial(models.Model):
    name = models.CharField(max_length=255, default='init')
    created = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['-created']

    def __str__(self):
        return 'Initial {} created at {} '.format(self.name, self.created)
