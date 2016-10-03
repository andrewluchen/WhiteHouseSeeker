from django.contrib.auth.models import User
from django import forms

from usgs import models

class UserForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput())

    class Meta:
        model = User
        fields = ('username', 'email', 'password')


class CharacterForm(forms.ModelForm):

    class Meta:
        model = models.Character
        fields = (
            'name',
            'birthday',
            'gender',
            'residence',
            'state',
            'party',
            'avatar',
            'bio',
        )
