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
    'rest_framework',
    'rest_framework.authtoken',
    'djoser',
    'social_django',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',
    'allauth.socialaccount.providers.facebook',
    'corsheaders',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',
    'django_extensions',
    'crispy_forms',
]

if settings.DEBUG:
    THIRD_PARTY_APPS += 'whitenoise.runserver_nostatic',

LOCAL_APPS = ['users.apps.UsersConfig']

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'core.middleware.cors_middleware.AccessControlAllowOriginMiddleware',
    'django.middleware.security.SecurityMiddleware',
    "django_permissions_policy.PermissionsPolicyMiddleware",
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
]

if not settings.DEBUG:
    MIDDLEWARE += 'csp.middleware.CSPMiddleware',

# Common & Templates
# ------------------------------------------------------------------------------
ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates'),],
        # 'APP_DIRS': True,
        'OPTIONS': {
            'loaders': [
                'django.template.loaders.filesystem.Loader',
                'django.template.loaders.app_directories.Loader',
            ],
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
    'social_core.backends.google.GoogleOAuth2',
    'social_core.backends.facebook.FacebookOAuth2',
    'allauth.account.auth_backends.AuthenticationBackend',
    'django.contrib.auth.backends.ModelBackend',
]

LOGIN_REDIRECT_URL = config(
    'LOGIN_REDIRECT_URL', default='http://127.0.0.1:8000/auth/users/me/')

LOGIN_URL = config(
    'LOGIN_URL', default='http://127.0.0.1:8000/auth/jwt/create/')


# django-allauth
# ------------------------------------------------------------------------------
ACCOUNT_ALLOW_REGISTRATION = True

ACCOUNT_AUTHENTICATION_METHOD = 'username_email'

ACCOUNT_EMAIL_REQUIRED = True

ACCOUNT_USERNAME_REQUIRED = True

ACCOUNT_EMAIL_VERIFICATION = 'none'

ACCOUNT_ADAPTER = 'users.adapters.AccountAdapter'

SOCIALACCOUNT_ADAPTER = 'users.adapters.SocialAccountAdapter'

ACCOUNT_SIGNUP_PASSWORD_ENTER_TWICE = False

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
if not settings.DEBUG:
    CORS_ORIGIN_ALLOW_ALL = False
else:
    CORS_ORIGIN_ALLOW_ALL = True

CORS_ALLOW_CREDENTIALS = True

CORS_ALLOWED_ORIGINS = [
    'https://nurtsrx.herokuapp.com',
    'http://127.0.0.1:3000',
    'http://localhost:3000',
    'http://127.0.0.1:8000',
    'http://localhost:8000',
]
CORS_ORIGIN_WHITELIST = (
    'http://127.0.0.1:3000',
    'http://localhost:3000',
    'http://127.0.0.1:8000',
    'http://localhost:8000',
)

CORS_EXPOSE_HEADERS = (
    'Access-Control-Allow-Origin: *',
)

CORS_ALLOW_HEADERS = default_headers + (
    'Access-Control-Allow-Origin',
)

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
        'rest_framework.authentication.TokenAuthentication',
        # 'rest_framework.authentication.BasicAuthentication',
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        'rest_framework.permissions.AllowAny'
    ],
    "DEFAULT_RENDERER_CLASSES": DEFAULT_RENDERER_CLASSES,

    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    # 'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.LimitOffsetPagination',

    'PAGE_SIZE': 10
}

# Djoser & Python Social Auth & dj-rest-auth(Social)
# ------------------------------------------------------------------------------

SOCIAL_AUTH_JSONFIELD_ENABLED = True
SOCIAL_AUTH_RAISE_EXCEPTIONS = False

DJOSER = {
    # 'LOGIN_FIELD': 'email',
    'USER_CREATE_PASSWORD_RETYPE': True,
    'USERNAME_CHANGED_EMAIL_CONFIRMATION': True,
    'PASSWORD_CHANGED_EMAIL_CONFIRMATION': True,
    'SEND_CONFIRMATION_EMAIL': True,
    'SET_USERNAME_RETYPE': True,
    'SET_PASSWORD_RETYPE': True,
    'USERNAME_RESET_CONFIRM_URL': 'password/reset/confirm/{uid}/{token}',
    'PASSWORD_RESET_CONFIRM_URL': 'email/reset/confirm/{uid}/{token}',
    'ACTIVATION_URL': config('ACTIVATION_URL', default='auth/users/activate/{uid}/{token}/'),
    'SEND_ACTIVATION_EMAIL': True,
    'SOCIAL_AUTH_TOKEN_STRATEGY': 'djoser.social.token.jwt.TokenStrategy',
    'SOCIAL_AUTH_ALLOWED_REDIRECT_URIS': [
        'https://www.arnelimperial.com',
        'https://www.arnelimperial.com/login',
        'http://localhost:3000',
        'http://localhost:3000/login',
        'http://127.0.0.1:8000/accounts/google/login/callback/',
        'http://127.0.0.1:8000/api/social-credentials/',
    ],
    "SERIALIZERS": {
        "user": "djoser.serializers.UserSerializer",
        "current_user": "djoser.serializers.UserSerializer",
        "user_delete": "djoser.serializers.UserSerializer",
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
    'fields': 'id, name, email, username, first_name, last_name',
}

# Other ENV Vars
DJOSER_USER_ACTIVATE_URL = config(
    'DJOSER_USER_ACTIVATE_URL', default='http://127.0.0.1:8000/auth/users/activation/')


# Simple JWT
# ------------------------------------------------------------------------------

SIMPLE_JWT = {
    # 'AUTH_HEADER_TYPES': ('JWT',),
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
}

# Static files (CSS, JavaScript, Images) & Media
# ------------------------------------------------------------------------------
CRISPY_TEMPLATE_PACK = "bootstrap5"

STATIC_URL = 'static/'

STATICFILES_FINDERS = [
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
]

STATICFILES_DIRS = (
    os.path.join(BASE_DIR, 'static'),
)

MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

MEDIA_URL = "/media/"

if not settings.DEBUG:
    STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
    STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# ADMIN
# ------------------------------------------------------------------------------
# Django Admin URL.
ADMIN_URL = config('ADMIN_URL', default='admin/')

ADMINS = [("""Synchro API""", 'arnelimperial.com')]

MANAGERS = ADMINS

# Security
# ------------------------------------------------------------------------------
SESSION_COOKIE_HTTPONLY = True

SECURE_BROWSER_XSS_FILTER = True

X_FRAME_OPTIONS = 'DENY'

CSRF_COOKIE_HTTPONLY = True

if not settings.DEBUG:

    SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

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

    SECURE_REFERRER_POLICY = config('REFERRER_POLICY', default='same-origin')

    CORS_REPLACE_HTTPS_REFERER = True

    PERMISSIONS_POLICY = {
        "geolocation": [],
        "autoplay": [],
        "microphone": [],
        "camera": [],
        "fullscreen": []
    }

    CSP_DEFAULT_SRC = ("'self'",)
    CSP_STYLE_SRC = ("'self'", "'unsafe-inline'", "fonts.googleapis.com", "https://cdnjs.cloudflare.com/ajax/libs/bootswatch/5.2.3/spacelab/bootstrap.min.css",
                     "'sha512-kb6aHe8Fchic05HVLuEio/LWsmwtNRndUxZ5AqK4IyMG817Dhff2BxuKJCRPWzQ4daCxN5TagQ5s8Hpo9YJgbQ=='",)
    CSP_SCRIPT_SRC = ("'self'", "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js", "https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js",
                      "'sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN'", "'sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN'",)
    CSP_FONT_SRC = ("'self'", "fonts.gstatic.com", "*")
    CSP_IMG_SRC = ("'self'", "*")
    CSP_INCLUDE_NONCE_IN = ["script-src"]
    CSP_OBJECT_SRC = ("'none'", )
    CSP_BASE_URI = ("'none'", )
    CSP_CONNECT_SRC = ("'self'",)
    CSP_FRAME_ANCESTORS = ("'none'", )
