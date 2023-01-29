from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path, re_path
from django.views import defaults as default_views
from rest_framework.authtoken.views import obtain_auth_token
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from dj_rest_auth.registration.views import RegisterView, VerifyEmailView, ConfirmEmailView
from dj_rest_auth.views import LoginView, LogoutView


urlpatterns = [
    path(settings.ADMIN_URL, admin.site.urls),
    path('users/', include('users.urls', namespace='users')),
    path('accounts/', include("allauth.urls")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# API URLS
urlpatterns += [
    # API base URL
    path('api/', include('core.api_router')),
    # DRF auth token
    path('auth-token/', obtain_auth_token),
    # Login via browsable API
    path('api-auth/', include('rest_framework.urls')),
    # Auth via dj-rest-auth
    path(
        'dj-rest-auth/registration/account-confirm-email/<str:key>/',
        ConfirmEmailView.as_view(),
    ),  # Needs to be defined before the registration path
    path('dj-rest-auth/registration/', RegisterView.as_view()),
    path('dj-rest-auth/login/', LoginView.as_view(), name='dj_rest_login'),
    path('dj-rest-auth/logout/', LogoutView.as_view(), name='dj_rest_logout'),

    path('dj-rest-auth/verify-email/',
         VerifyEmailView.as_view(), name='rest_verify_email'),
    path('dj-rest-auth/account-confirm-email/', VerifyEmailView.as_view(),
         name='account_email_verification_sent'),
    re_path(r'^dj-rest-auth/account-confirm-email/(?P<key>[-:\w]+)/$',
            VerifyEmailView.as_view(), name='account_confirm_email'),
    # Simple JWT
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
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
