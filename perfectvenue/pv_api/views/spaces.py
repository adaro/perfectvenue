from django.contrib.auth import login
from django.shortcuts import redirect, HttpResponse
from django.views.generic import CreateView, View
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.core import serializers
from ..models import Space, Venue
import json

@method_decorator(login_required, name='dispatch')
class SpaceView(View):
    def get(self, request, space_id=None):
        if request.GET.get('venue'):
            venue_object = Venue.objects.get(id=request.GET.get('venue'))  # TODO: handle does not exists here

            if request.GET.get('start_date') and request.GET.get('end_date'):
                spaces = Space.is_booked(venue_object, request.GET.get('start_date'), request.GET.get('end_date'))
                return HttpResponse(json.dumps(spaces), content_type="application/json")
                # TODO: return spaces that are available for this date.

            spaces = serializers.serialize("json", Space.objects.filter(venue=venue_object))
            return HttpResponse(spaces, content_type="application/json")

        elif space_id:
            venue = serializers.serialize("json", Space.objects.filter(id=space_id))
            return HttpResponse(venue, content_type="application/json")

        spaces = serializers.serialize("json", Space.objects.all())
        return HttpResponse(spaces, content_type="application/json")

    def post(self, request):
        pass