from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path, re_path
from django.http import HttpResponseRedirect
from django.views import defaults as default_views
from rest_framework.authtoken.views import obtain_auth_token
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView
)

from client.views import client_view
from users.api.views import ActivateUser, UserRedirectSocialFacebook, UserRedirectSocialGoogle, UserRedirectSocialViewGoogle, UsersList, UserRetrieveDestroy, FacebookLogin


urlpatterns = [
    path(settings.ADMIN_URL, admin.site.urls),
    path('users/', include('users.urls', namespace='users')),
    path('accounts/', include("allauth.urls")),
    path('favicon.ico', lambda x: HttpResponseRedirect(
        settings.STATIC_URL + 'favicon.ico')),
    path('robots.txt', lambda x: HttpResponseRedirect(
        settings.STATIC_URL + 'robots.txt')),
    path('manifest.json', lambda x: HttpResponseRedirect(
        settings.STATIC_URL + 'manifest.json')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# API URLS
urlpatterns += [
    # API base URL
    path('api/', include('core.api_router')),
    # DRF auth token
    path('auth-token/', obtain_auth_token),
    # Login via browsable API
    path('api-auth/', include('rest_framework.urls')),
    # Rest Auth via djoser
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.authtoken')),
    path('auth/', include('djoser.urls.jwt')),
    path('auth/social/', include('djoser.social.urls')),
    path('auth/users/activate/<uid>/<token>',
         ActivateUser.as_view(), name='activation'),
    # Djoser redirect after social login
    path('api/social-credentials/google/<code>/',
         UserRedirectSocialGoogle.as_view(), name='redirect_social_google'),
    path('api/social-credentials/facebook/<code>/',
         UserRedirectSocialFacebook.as_view(), name='redirect_social_facebook'),
    # Simple JWT
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),

     # dj-rest-auth (Social)
    path('api/rest-auth/facebook/', FacebookLogin.as_view(), name='fb_login'),

    # Users
    path('api/users/list/', UsersList.as_view(), name='users-lists'),
    path('api/users/retrieve-destroy/<username>/',
         UserRetrieveDestroy.as_view(), name='users-retrieve-destroy'),

   
]

# URL patterns for frontend
urlpatterns += [
    re_path(r'^.*$', view=client_view, name='client-app'),

]

if settings.DEBUG:
    urlpatterns += [
        path(
            "400/",
            default_views.bad_request,
            kwargs={"exception": Exception("Bad Request!")},
        ),
        path(
            "403/",
            default_views.permission_denied,
            kwargs={"exception": Exception("Permission Denied")},
        ),
        path(
            "404/",
            default_views.page_not_found,
            kwargs={"exception": Exception("Page not Found")},
        ),
        path("500/", default_views.server_error),
    ]
