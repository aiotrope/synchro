import os
from decouple import config, Csv
from django.conf import settings
from pathlib import Path
import dj_database_url
from corsheaders.defaults import default_headers
from datetime import timedelta

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = config('SECRET_KEY')

DEBUG = config('DEBUG', default=False, cast=bool)

ALLOWED_HOSTS = config('ALLOWED_HOSTS', cast=Csv())

# Application definition & Middlewares
# ------------------------------------------------------------------------------
DJANGO_APPS = [
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    "django.contrib.sites",
    'django.contrib.messages',
    'django.contrib.staticfiles',
    "django.contrib.humanize",
    'django.contrib.admin',
    'django.forms',
]

THIRD_PARTY_APPS = [
    'corsheaders',
    'whitenoise.runserver_nostatic',
    'rest_framework',
    'rest_framework.authtoken',
    'djoser',
    'social_django',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',
    'allauth.socialaccount.providers.facebook',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',
    'django_extensions',
    'crispy_forms',
    'dj_rest_auth',
]

LOCAL_APPS = [
    'users.apps.UsersConfig',
    'client.apps.ClientConfig',
]

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'core.middleware.cors_middleware.AccessControlAllowOriginMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django_permissions_policy.PermissionsPolicyMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.middleware.common.BrokenLinkEmailsMiddleware',
    'social_django.middleware.SocialAuthExceptionMiddleware',
    'csp.middleware.CSPMiddleware',
]

# Common & Templates
# ------------------------------------------------------------------------------
ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            os.path.join(BASE_DIR, 'build'),
            os.path.join(BASE_DIR, 'templates'),
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'django.template.context_processors.i18n',
                'django.template.context_processors.media',
                'django.template.context_processors.static',
                'django.template.context_processors.tz',
                'social_django.context_processors.backends',
                'social_django.context_processors.login_redirect',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'

TIME_ZONE = "Europe/Helsinki"

LANGUAGE_CODE = "en-us"

SITE_ID = 1

USE_I18N = True

USE_L10N = True

USE_TZ = True

USE_THOUSAND_SEPARATOR = True

FORM_RENDERER = "django.forms.renderers.TemplatesSetting"

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Database
# ------------------------------------------------------------------------------
db_from_env = config('DATABASE_URL')

DATABASES = {
    'default': dj_database_url.config(
        default=db_from_env,
        conn_max_age=600,
        conn_health_checks=True,
    )
}

# Authentication
# ------------------------------------------------------------------------------
AUTH_USER_MODEL = 'users.User'

AUTHENTICATION_BACKENDS = [
    'users.api.views.CustomGoogleOAuth2',
    'users.api.views.CustomFacebookOAuth2',
    'allauth.account.auth_backends.AuthenticationBackend',
    'django.contrib.auth.backends.ModelBackend',
]

LOGIN_REDIRECT_URL = config(
    'LOGIN_REDIRECT_URL', default='http://127.0.0.1:8000')

LOGIN_URL = config(
    'LOGIN_URL', default='http://127.0.0.1:8000/login')


# django-allauth
# ------------------------------------------------------------------------------
ACCOUNT_ALLOW_REGISTRATION = True

ACCOUNT_AUTHENTICATION_METHOD = 'username_email'

ACCOUNT_EMAIL_REQUIRED = True

ACCOUNT_USERNAME_REQUIRED = True

ACCOUNT_EMAIL_VERIFICATION = 'none'

ACCOUNT_ADAPTER = 'users.adapters.AccountAdapter'

SOCIALACCOUNT_ADAPTER = 'users.adapters.SocialAccountAdapter'

ACCOUNT_SESSION_REMEMBER = True

ACCOUNT_UNIQUE_EMAIL = True

ACCOUNT_CONFIRM_EMAIL_ON_GET = True

ACCOUNT_LOGIN_ON_EMAIL_CONFIRMATION = True


# Password
# ------------------------------------------------------------------------------
PASSWORD_HASHERS = [
    "django.contrib.auth.hashers.Argon2PasswordHasher",
    "django.contrib.auth.hashers.PBKDF2PasswordHasher",
    "django.contrib.auth.hashers.PBKDF2SHA1PasswordHasher",
    "django.contrib.auth.hashers.BCryptSHA256PasswordHasher",
]

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Email
# ------------------------------------------------------------------------------
EMAIL_BACKEND = config(
    'EMAIL_BACKEND', default='django.core.mail.backends.smtp.EmailBackend'
)

DEFAULT_FROM_EMAIL = config('DEFAULT_FROM_EMAIL', cast=str)

SERVER_EMAIL = config('SERVER_EMAIL', default=DEFAULT_FROM_EMAIL)

EMAIL_HOST = config('EMAIL_HOST', default='mail.smtp2go.com')

EMAIL_HOST_USER = config('EMAIL_HOST_USER')

EMAIL_HOST_PASSWORD = config('EMAIL_HOST_PASSWORD')

EMAIL_PORT = 2525

EMAIL_USE_TLS = True

EMAIL_TIMEOUT = 3600

# CORS
# ------------------------------------------------------------------------------
CORS_ORIGIN_ALLOW_ALL = False

CORS_ALLOW_CREDENTIALS = True

CSRF_HEADER_NAME = 'X-CSRFToken'

CSRF_COOKIE_NAME = 'csrftoken'

CORS_EXPOSE_HEADERS = ['Content-Type',
                       'X-CSRFToken', 'Access-Control-Allow-Origin: *',]

CORS_ALLOW_CREDENTIALS = True

CORS_ALLOWED_ORIGINS = [
    'https://www.arnelimperial.com',
    'https://synchro-web.onrender.com',
    'http://127.0.0.1:3000',
    'http://localhost:3000',
    'http://127.0.0.1:8000',
    'http://localhost:8000',
]
CORS_ORIGIN_WHITELIST = (
    'https://www.arnelimperial.com',
    'https://synchro-web.onrender.com',
    'http://127.0.0.1:3000',
    'http://localhost:3000',
    'http://127.0.0.1:8000',
    'http://localhost:8000',
)

CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
    'Access-Control-Allow-Origin',
    'cache-control',
    'if-modified-since',
    'keep-alive',
    'X-Mx-ReqToken',
    'XMLHttpRequest'
]

CORS_PREFLIGHT_MAX_AGE = 86400

# django-rest-framework
# -------------------------------------------------------------------------------

DEFAULT_RENDERER_CLASSES = (
    'rest_framework.renderers.JSONRenderer',
)

if DEBUG:
    DEFAULT_RENDERER_CLASSES = DEFAULT_RENDERER_CLASSES + \
        ('rest_framework.renderers.BrowsableAPIRenderer',)

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'dj_rest_auth.jwt_auth.JWTCookieAuthentication',
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        'rest_framework.permissions.AllowAny'
    ],
    "DEFAULT_RENDERER_CLASSES": DEFAULT_RENDERER_CLASSES,

    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    # 'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.LimitOffsetPagination',

    'PAGE_SIZE': 10
}

# Simple JWT
# ------------------------------------------------------------------------------

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=2),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
}

# Djoser & Python Social Auth
# ------------------------------------------------------------------------------

SOCIAL_AUTH_JSONFIELD_ENABLED = True
SOCIAL_AUTH_RAISE_EXCEPTIONS = False

DJOSER = {
    'USER_CREATE_PASSWORD_RETYPE': True,
    'USERNAME_CHANGED_EMAIL_CONFIRMATION': True,
    'PASSWORD_CHANGED_EMAIL_CONFIRMATION': True,
    'PASSWORD_RESET_CONFIRM_RETYPE': True,
    'SEND_CONFIRMATION_EMAIL': True,
    'SET_USERNAME_RETYPE': True,
    'SET_PASSWORD_RETYPE': True,
    'USERNAME_RESET_CONFIRM_URL': 'auth/username/reset/confirm/{uid}/{token}',
    'PASSWORD_RESET_CONFIRM_URL': 'auth/password/reset/confirm/{uid}/{token}',
    'ACTIVATION_URL': config('ACTIVATION_URL', default='auth/users/activate/{uid}/{token}'),
    'SEND_ACTIVATION_EMAIL': True,
    'HIDE_USERS': False,
    'SOCIAL_AUTH_TOKEN_STRATEGY': 'djoser.social.token.jwt.TokenStrategy',
    'SOCIAL_AUTH_ALLOWED_REDIRECT_URIS': [
        'https://www.arnelimperial.com',
        'https://www.arnelimperial.com/login',
        'https://www.arnelimperial.com/api/social-credentials/google/',
        'https://www.arnelimperial.com/api/social/facebook/',
        'https://www.arnelimperial.com/api/social/facebook',
        'https://www.arnelimperial.com/accounts/google/login/callback/',
        'https://www.arnelimperial.com/auth/users/activate',
        'https://synchro-web.onrender.com',
        'https://synchro-web.onrender.com/login',
        'https://synchro-web.onrender.com/api/social-credentials/google/',
        'https://synchro-web.onrender.com/api/social/facebook/',
        'https://synchro-web.onrender.com/api/social/facebook',
        'https://synchro-web.onrender.com/accounts/google/login/callback/',
        'https://synchro-web.onrender.com/auth/users/activate',
        'http://127.0.0.1:8000/',
        'http://127.0.0.1:8000/login',
        'http://127.0.0.1:8000/api/social-credentials/google/',
        'http://127.0.0.1:8000/api/social/facebook/',
        'http://127.0.0.1:8000/accounts/google/login/callback/',
        'http://127.0.0.1:8000/auth/users/activate',

    ],
    'SERIALIZERS': {
        'user': 'djoser.serializers.UserSerializer',
        'current_user': 'djoser.serializers.UserSerializer',
        'user_delete': 'djoser.serializers.UserSerializer',
    },

}
# Google Credentials
SOCIAL_AUTH_GOOGLE_OAUTH2_KEY = config('SOCIAL_AUTH_GOOGLE_OAUTH2_KEY')
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = config('SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET')
SOCIAL_AUTH_GOOGLE_OAUTH2_SCOPE = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'openid'
]
SOCIAL_AUTH_GOOGLE_OAUTH2_EXTRA_DATA = ['first_name', 'last_name']

# FB Credentials
SOCIAL_AUTH_FACEBOOK_KEY = config('SOCIAL_AUTH_FACEBOOK_KEY')
SOCIAL_AUTH_FACEBOOK_SECRET = config('SOCIAL_AUTH_FACEBOOK_SECRET')
SOCIAL_AUTH_FACEBOOK_SCOPE = ['email']
SOCIAL_AUTH_FACEBOOK_PROFILE_EXTRA_PARAMS = {
    'fields': 'email, name'
}

# Other ENV Vars
DJOSER_USER_ACTIVATE_URL = config(
    'DJOSER_USER_ACTIVATE_URL', default='http://127.0.0.1:8000/auth/users/activation/')


SOCIAL_AUTH_FIELDS_STORED_IN_SESSION = ['state']

# dj-rest-auth
# ------------------------------------------------------------------------------

REST_AUTH = {
    'USE_JWT': True,
    'JWT_AUTH_COOKIE': config('JWT_AUTH_COOKIE'),
    'JWT_AUTH_REFRESH_COOKIE': config('JWT_AUTH_REFRESH_COOKIE'),
    'PASSWORD_RESET_USE_SITES_DOMAIN': False,
}

# ADMIN
# ------------------------------------------------------------------------------
# Django Admin URL.
ADMIN_URL = config('ADMIN_URL', default='admin/')

ADMINS = [("""Synchro API""", 'arnelimperial.com')]

MANAGERS = ADMINS

# Security
# ------------------------------------------------------------------------------
SESSION_COOKIE_HTTPONLY = False

X_FRAME_OPTIONS = 'DENY'

CSRF_COOKIE_HTTPONLY = False

# CSP Config
CSP_DEFAULT_SRC = ("'none'",)
CSP_STYLE_SRC = ("'self'", 'fonts.googleapis.com')
CSP_SCRIPT_SRC = ("'self'", 'https://connect.facebook.net/en_US/sdk.js',)
CSP_FONT_SRC = ("'self'", 'fonts.gstatic.com')
CSP_IMG_SRC = ("'self'", "*", "data:",)
CSP_CONNECT_SRC = ("'self'", "*")
CSP_MANIFEST_SRC = ("'self'",)
CSP_OBJECT_SRC = ("'none'",)

if not settings.DEBUG:

    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

    SECURE_SSL_REDIRECT = config(
        'SECURE_SSL_REDIRECT', default=True, cast=bool)

    SESSION_COOKIE_SECURE = config(
        'SESSION_COOKIE_SECURE', default=True, cast=bool)

    CSRF_COOKIE_SECURE = config('CSRF_COOKIE_SECURE', default=True, cast=bool)

    SECURE_HSTS_SECONDS = config(
        'SECURE_HSTS_SECONDS', default=18408206, cast=int)  # 60

    SECURE_HSTS_INCLUDE_SUBDOMAINS = config(
        'SECURE_HSTS_INCLUDE_SUBDOMAINS', default=True, cast=bool)

    SECURE_HSTS_PRELOAD = config(
        'SECURE_HSTS_PRELOAD', default=True, cast=bool)

    SECURE_CONTENT_TYPE_NOSNIFF = config(
        'SECURE_CONTENT_TYPE_NOSNIFF', default=True, cast=bool)

    SECURE_REFERRER_POLICY = config(
        'REFERRER_POLICY', default='no-referrer-when-downgrade')

    CORS_REPLACE_HTTPS_REFERER = True

    CSRF_TRUSTED_ORIGINS = [
        'https://www.arnelimperial.com',
        'https://synchro-web.onrender.com',
    ]

    PERMISSIONS_POLICY = {
        "geolocation": [],
        "autoplay": [],
        "microphone": [],
        "camera": [],
        "fullscreen": []
    }

# Static files (CSS, JavaScript, Images) & Media
# ------------------------------------------------------------------------------
CRISPY_TEMPLATE_PACK = "bootstrap5"

STATIC_URL = '/static/'

STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'build', 'static'),
    os.path.join(BASE_DIR, 'public', 'assets')
]

MEDIA_URL = "/media/"

STATIC_ROOT = os.path.join(BASE_DIR, 'build', 'assets')

MEDIA_ROOT = os.path.join(BASE_DIR, 'build', 'media')

STATICFILES_FINDERS = [
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
]

STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
