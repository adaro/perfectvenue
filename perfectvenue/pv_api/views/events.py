from django.contrib.auth import login
from django.shortcuts import redirect
from django.views.generic import CreateView, View

from perfectvenue.forms import EventCoordinatorSignUpForm
from ..models import User

class CoordinatorSignUpView(CreateView):
    model = User
    form_class = EventCoordinatorSignUpForm
    template_name = 'registration/sign-up.html'

    def user_type(self):
        return 'event_coordinator'

    def form_valid(self, form):
        user = form.save()
        login(self.request, user)
        return redirect('events:home')


class HomeView(View):
    def get(self):
        pass

    def post(self):
        pass