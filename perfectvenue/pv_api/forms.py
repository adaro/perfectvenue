from django.forms import ModelForm
from django import forms
from models import Event


class EventForm(ModelForm):
    class Meta:
        model = Event
        fields = '__all__'

        widgets = {
            'start_date': forms.DateTimeInput(attrs={'class':'datepicker'}),
            'end_date': forms.DateTimeInput(attrs={'class': 'datepicker'}),
        }

