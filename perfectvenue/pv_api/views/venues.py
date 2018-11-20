from django.contrib.auth import login
from django.shortcuts import redirect
from django.views.generic import CreateView

from perfectvenue.forms import VenueCoordinatorSignUpForm
from ..models import User

class CoordinatorSignUpView(CreateView):
    model = User
    form_class = VenueCoordinatorSignUpForm
    template_name = 'registration/sign-up.html'

    def user_type(self):
        return 'venue_coordinator'

    def form_valid(self, form):
        user = form.save()
        login(self.request, user)
        return redirect('venues:venue_list')