from django.conf.urls import url
from pv_api.views import events, venues, spaces

urlpatterns = [
    url('events/$', events.EventView.as_view(), name='events'),
    url('events/(?P<event_id>\w+)/$', events.EventView.as_view(), name='event'),
    url('venues/$', venues.VenueView.as_view(), name='venues'),
    url('venues/(?P<venue_id>\w+)/$', venues.VenueView.as_view(), name='venue'),
    url('spaces/$', spaces.SpaceView.as_view(), name='spaces'),
    url('spaces/(?P<space_id>\w+)/$', spaces.SpaceView.as_view(), name='space'),
]
