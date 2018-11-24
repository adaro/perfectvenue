from django.contrib.auth import login
from django.shortcuts import render, redirect, HttpResponse
from django.views.generic import CreateView, View
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.core import serializers
from perfectvenue.forms import VenueCoordinatorSignUpForm
from perfectvenue import settings
from ..models import User, Venue
from ..forms import VenueForm

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
        return redirect(settings.HOSTS[settings.ENV]['client'])


@method_decorator(login_required, name='dispatch')
class VenueView(View):
    form = VenueForm()

    def get(self, request, venue_id=None):
        if request.GET.get('name'):
            venues = serializers.serialize("json", Venue.objects.filter(name__icontains=request.GET.get('name')))
            return HttpResponse(venues, content_type="application/json")
        if venue_id:
            venue = serializers.serialize("json", Venue.objects.filter(id=venue_id))
            return HttpResponse(venue, content_type="application/json")

        return render(request, 'venues/venue.html', {"form": self.form})

    def post(self, request):
        venue_form = VenueForm(request.POST)
        venue_form.save()
        #TODO: send reponse back to iframe to close? or simply render a thankyou style view
        return redirect(settings.HOSTS[settings.ENV]['client'])