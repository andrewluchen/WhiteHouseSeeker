from django import forms

from usgs.character.models import Character


class CharacterForm(forms.ModelForm):

    class Meta:
        model = Character
        fields = (
            'primary',
            'name',
            'birthday',
            'gender',
            'residence',
            'state',
            'party',
            'avatar',
            'bio',
        )
