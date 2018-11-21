from django.contrib.auth.forms import UserCreationForm
from django.db import transaction

from pv_api.models import User


class VenueCoordinatorSignUpForm(UserCreationForm):

    class Meta(UserCreationForm.Meta):
        model = User

    @transaction.atomic
    def save(self):
        user = super(VenueCoordinatorSignUpForm, self).save(commit=False)
        user.is_venue_coordinator = True
        user.save()
        print 'Creating Venue Coord'
        return user

class EventCoordinatorSignUpForm(UserCreationForm):

    class Meta(UserCreationForm.Meta):
        model = User

    @transaction.atomic
    def save(self):
        user = super(EventCoordinatorSignUpForm, self).save(commit=False)
        user.is_event_coordinator = True
        user.save()
        print 'Creating Event Coord'
        return user



