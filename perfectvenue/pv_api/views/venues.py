from django.contrib.auth import login
from django.shortcuts import redirect, HttpResponse
from django.views.generic import CreateView, View
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.core import serializers
from perfectvenue.forms import VenueCoordinatorSignUpForm
from ..models import User, Venue

class CoordinatorSignUpView(CreateView):
    model = User
    form_class = VenueCoordinatorSignUpForm
    template_name = 'registration/sign-up.html'

    def user_type(self):
        return 'venue_coordinator'

    def form_valid(self, form):
        user = form.save()
        login(self.request, user)
        # TODO: this will redirect to a frontend view
        return redirect('api:venues')


@method_decorator(login_required, name='dispatch')
class VenueView(View):
    def get(self, request):
        print 'Got Venues'
        venues = serializers.serialize("json", Venue.objects.all())
        return HttpResponse(venues, content_type="application/json")

    def post(self, request):
        pass