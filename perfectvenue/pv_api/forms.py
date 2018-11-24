from django.forms import ModelForm
from django import forms
from models import Event, Venue


class EventForm(ModelForm):
    class Meta:
        model = Event
        fields = '__all__'

        widgets = {
            'start_date': forms.DateTimeInput(attrs={'class':'datepicker'}),
            'end_date': forms.DateTimeInput(attrs={'class': 'datepicker'}),
        }


# We'll eventually want address auto complete for this form
# See https://django-map-widgets.readthedocs.io/en/latest/widgets/point_field_map_widgets.html
class VenueForm(ModelForm):
    class Meta:
        model = Venue
        fields = '__all__'


