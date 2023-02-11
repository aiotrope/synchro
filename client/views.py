from django.views.generic.base import TemplateView
from django.views.decorators.cache import never_cache


class IndexTemplateView(TemplateView):
    def get_template_names(self):
        template_name = 'index.html'
        return template_name


client_view = never_cache(IndexTemplateView.as_view())
