from django.contrib.auth import login
from django.shortcuts import render, redirect, HttpResponse
from django.views.generic import CreateView, View
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.core import serializers
from rest_framework.authtoken.models import Token
from perfectvenue.forms import VenueCoordinatorSignUpForm
from perfectvenue import settings
import json
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
        return redirect('/accounts/redirect/')


class VenueView(View):
    def get(self, request, venue_id=None):
        if request.GET.get('name'):
            venues = serializers.serialize("json", Venue.objects.filter(name__icontains=request.GET.get('name')))
            return HttpResponse(venues, content_type="application/json")
        if venue_id:
            venue = serializers.serialize("json", Venue.objects.filter(id=venue_id))
            return HttpResponse(venue, content_type="application/json")

        venues = serializers.serialize("json", Venue.objects.all())
        return HttpResponse(venues, content_type="application/json")

    def post(self, request):
        venue_form = VenueForm(request.POST)
        venue_saved = venue_form.save()
        return redirect("{}{}{}".format("/api/venues/", venue_saved.id, "/created"))

    def delete(self, request, venue_id):
        venue = Venue.objects.get(id=venue_id)
        venue.delete()
        return HttpResponse(json.dumps({"success": True}), content_type="application/json")

class CreatedVenueView(View):
    def get(self, request, venue_id=None):
        venue = Venue.objects.get(id=venue_id)
        return render(request, 'venues/created.html', context={'venue': venue,
                                                               "client": settings.HOSTS[settings.ENV]['client'],
                                                               })

@method_decorator(login_required, name='dispatch')
class AddVenue(View):
    form = VenueForm()

    def get(self, request):
        token = Token.objects.get(user=request.user)
        return render(request, 'venues/venue.html', {
            "form": self.form,
            "client": settings.HOSTS[settings.ENV]['client'],
            "token": token.key
        })