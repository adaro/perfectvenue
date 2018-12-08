from django.contrib.auth import login
from django.shortcuts import redirect, HttpResponse, render
from django.views.generic import CreateView, View
from django.utils.decorators import method_decorator
from django.core import serializers
from perfectvenue.forms import EventCoordinatorSignUpForm
from perfectvenue import settings
from rest_framework.authtoken.models import Token
from django.contrib.auth.decorators import login_required
from django.forms.models import model_to_dict
from datetime import timedelta

from ..forms import EventForm
from ..models import User, Event, Venue, Space
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
        return redirect('/accounts/redirect/')

# @method_decorator(login_required, name='dispatch')
class CreateEventView(View):
    form = EventForm()

    def get(self, request):
        if request.GET.get('venue') and request.GET.get('start_date') and request.GET.get('end_date'):
            start_date = request.GET.get('start_date')
            end_date = request.GET.get('end_date')
            venue_object = Venue.objects.get(id=request.GET.get('venue'))

            spaces = Space.get_spaces_by_date(venue_object, start_date, end_date)
            space_ids = list(space['id'] for space in spaces['available'])
            spaces_qs = Space.objects.filter(venue=venue_object, id__in=space_ids)

            self.form.fields["spaces"].queryset = spaces_qs
            self.form.initial["start_date"] = start_date
            self.form.initial["end_date"] = end_date
            self.form.initial["user"] = request.user.pk
            self.form.initial["venue"] = venue_object
            self.form.fields["venue"].queryset = Venue.objects.filter(id=venue_object.id)
            self.form.initial['venue'] = Venue.objects.get(id=venue_object.id)

        token = Token.objects.get(user=request.user)
        return render(request, 'events/event.html', {
            "form": self.form,
            "client": settings.HOSTS[settings.ENV]['client'],
            "token": token.key
        })

    def post(self, request):
        from dateutil.parser import parse
        print 'posting to event'
        form_object = json.loads(request.body)['params']

        print form_object

        end_time = parse(form_object['startDate']) + timedelta(minutes=form_object['duration'])


        # TODO: get spaces and get m2m ids
        # TODO: get user instance from Auth token

        venu_obj = Venue.objects.get(id=form_object['venue'])
        created_event = Event.objects.create(
            user=User.objects.get(id=1), # TODO: hardcoding this for now, will need to setup Auth token first
            name=form_object['name'],
            venue=venu_obj,
            start_date=form_object['startDate'],
            end_date=end_time,
            num_guests=form_object['guests'],
            notes=form_object['notes'],
        )
        for space in form_object['spaces']:
            space_obj = Space.objects.get(id=space['id'])
            created_event.spaces.add(space_obj)

        created_event.save()
        created_event = json.dumps({'id': created_event.id})
        return HttpResponse(created_event, content_type="application/json")


class CreatedEventView(View):
    def get(self, request, event_id=None):
        return render(request, 'events/created.html', context={"client": settings.HOSTS[settings.ENV]['client']})

# TODO: we need a custom domain in order to use Token based auth (or so i think). When ready turn this back on and test
# TODO: it works locally just fine and that's how i can be sure it's the SSL/HTTPS on AWS
# @method_decorator(api_view(["GET", "PUT"]), name='dispatch')
class EventView(View):
    def get(self, request, event_id=None):

        if request.GET.get('venue'):
            venue_object = Venue.objects.get(id=request.GET.get('venue'))
            # events = serializers.serialize("json", Event.objects.filter(venue=venue_object))

            qs = json.dumps([a.get_json() for a in Event.objects.filter(venue=venue_object)])

            return HttpResponse(qs, content_type="application/json")

        if request.GET.get('name'):
            events = serializers.serialize("json", Event.objects.filter(name__icontains=request.GET.get('name')))
            return HttpResponse(events, content_type="application/json")

        if event_id:
            qs = json.dumps([a.get_json() for a in Event.objects.filter(id=event_id)])
            return HttpResponse(qs, content_type="application/json")

    def put(self, request, event_id):
        json_request = json.loads(request.body)['params']
        event = Event.objects.get(id=event_id)
        event.status = json_request['status']
        event.save()
        updated_event = serializers.serialize("json", [event])
        return HttpResponse(updated_event, content_type="application/json")



