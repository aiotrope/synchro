from rest_framework import permissions
from django.contrib.auth import get_user_model

User = get_user_model()
coder = User.objects.filter(is_staff=True)


class PostOnlyPermission(permissions.BasePermission):

    def has_permission(self, request, view):
        if self.action in ('create',):
            return True
        return False


class PostOnlyPermission(permissions.BasePermission):

    def has_permission(self, request, view):
        user = request.user
        if request.method == 'POST':
            return True


class IsAdminPermission(permissions.IsAdminUser):

    def has_permission(self, request, view):
        if request.method == 'POST':
            return True


class IsOwnerOrAdmin(permissions.IsAuthenticated):

    def has_permission(self, request, view):
        user = request.user
        return user or user.is_staff

    def has_object_permission(self, request, view, obj):
        user = request.user
        return obj.user == user or user.is_staff


class IsOwnerOrAdminOrReadOnly(permissions.IsAuthenticated):

    def has_object_permission(self, request, view, obj):
        user = request.user
        if type(obj) == type(user) and obj == user:
            return True
        return request.method in permissions.SAFE_METHODS or user.is_staff
