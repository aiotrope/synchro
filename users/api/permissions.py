from rest_framework import permissions
from rest_framework.permissions import BasePermission, SAFE_METHODS
from django.contrib.auth import get_user_model

User = get_user_model()


class ReadOnly(BasePermission):
    def has_permission(self, request, view):
        return request.method in SAFE_METHODS


class IsAdminOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        else:
            return request.user.is_staff


class IsAuthorOrReadOnly(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):

        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.author == request.user


class IsOwnerOrAdmin(BasePermission):

    def has_permission(self, request, view):

        return request.user == User.objects.get(pk=request.user.id) or request.user.is_staff

    def has_object_permission(self, request, view, obj):

        return obj.user == request.user or request.user.is_staff
