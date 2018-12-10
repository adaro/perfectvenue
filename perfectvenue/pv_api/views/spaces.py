from django.shortcuts import HttpResponse
from django.views.generic import View
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.core import serializers
from ..models import Space, Venue
import json
from django.forms.models import model_to_dict


class SpaceView(View):
    def get(self, request, space_id=None):
        if request.GET.get('venue'):
            venue_object = Venue.objects.get(id=request.GET.get('venue'))  # TODO: handle does not exists here
            if request.GET.get('start_date'):
                spaces = Space.get_spaces_by_date(venue_object, request.GET.get('start_date'), request.GET.get('duration'))
                return HttpResponse(json.dumps(spaces), content_type="application/json")

            spaces = {'available': [], 'booked': []}
            spaces_qs = Space.objects.filter(venue=venue_object)
            for space in spaces_qs:
                spaces['available'].append(model_to_dict(space))
            print spaces
            return HttpResponse(json.dumps(spaces), content_type="application/json")

        elif space_id:
            venue = serializers.serialize("json", Space.objects.filter(id=space_id))
            return HttpResponse(venue, content_type="application/json")

        spaces = serializers.serialize("json", Space.objects.all())
        return HttpResponse(spaces, content_type="application/json")

    def post(self, request):
        form_object = json.loads(request.body)['params']
        venue_obj = Venue.objects.get(id=form_object['venue'])
        Space.objects.create(venue=venue_obj, name=form_object['name'], description=form_object['description'], photo=form_object['photo'])
        return HttpResponse(json.dumps({"success": True}), content_type="application/json")

    def delete(self, request, space_id):
        space = Space.objects.get(id=space_id)
        space.delete()
        return HttpResponse(json.dumps({"success": True}), content_type="application/json")