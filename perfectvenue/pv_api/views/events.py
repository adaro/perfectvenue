from django.contrib.auth import login
from django.shortcuts import redirect, HttpResponse, render
from django.views.generic import CreateView, View
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.core import serializers
from perfectvenue.forms import EventCoordinatorSignUpForm
from perfectvenue import settings
from ..forms import EventForm
from ..models import User, Event, Venue, Space


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
        return redirect(settings.HOSTS[settings.ENV]['client'])


@method_decorator(login_required, name='dispatch')
class EventView(View):
    form = EventForm()

    def get(self, request, event_id=None):
        if request.GET.get('venue') and request.GET.get('start_date') and request.GET.get('end_date'):
            start_date = request.GET.get('start_date')
            end_date = request.GET.get('end_date')
            venue_object = Venue.objects.get(id=request.GET.get('venue'))
            # events = Event.objects.filter(venue=venue_object,
            #                                start_date__gte=start_date,
            #                                end_date__lte=end_date)


            # TODO: this will require an approval process. The issue is we have spaces that might conflict  with this form
            spaces = Space.objects.filter(venue=venue_object)
            self.form.fields["spaces"].queryset = spaces

            self.form.initial["start_date"] = start_date
            self.form.initial["end_date"] = end_date

            # print self.form.fields["spaces"].queryset.exists() # TODO: if no spaces exist, then render an update

            self.form.fields["venue"].queryset = Venue.objects.filter(id=venue_object.id)
            self.form.initial['venue'] = Venue.objects.get(id=venue_object.id)

        if request.GET.get('name'):
            events = serializers.serialize("json", Event.objects.filter(name__icontains=request.GET.get('name')))
            return HttpResponse(events, content_type="application/json")
        if event_id:
            event = serializers.serialize("json", Event.objects.filter(id=event_id))
            return HttpResponse(event, content_type="application/json")

        return render(request, 'events/event.html', {"form": self.form})


    def post(self, request):
        print 'posting to event'
        event_form = EventForm(request.POST)
        new_event = serializers.serialize("json", [event_form.save()])
        return HttpResponse(new_event, content_type="application/json")

    def put(self, request, event_id):
        event = Event.objects.get(id=event_id)
        event_form = EventForm(request.POST, instance=event)
        updated_event = serializers.serialize("json", [event_form.save()])
        return HttpResponse(updated_event, content_type="application/json")



