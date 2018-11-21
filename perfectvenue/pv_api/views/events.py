from django.contrib.auth import login
from django.shortcuts import redirect, HttpResponse
from django.views.generic import CreateView, View
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.core import serializers
from perfectvenue.forms import EventCoordinatorSignUpForm
from ..models import User, Event
import json


class CoordinatorSignUpView(CreateView):
    model = User
    form_class = EventCoordinatorSignUpForm
    template_name = 'registration/sign-up.html'

    def user_type(self):
        return 'event_coordinator'

    def form_valid(self, form):
        user = form.save()
        login(self.request, user)
        # TODO: this will redirect to a frontend view
        return redirect('api:events')


@method_decorator(login_required, name='dispatch')
class EventView(View):
    def get(self, request):
        print 'Got Events'
        events = serializers.serialize("json", Event.objects.all())
        return HttpResponse(events, content_type="application/json")

    def post(self, request):
        pass