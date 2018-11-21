from django.conf.urls import url
from pv_api.views import events, venues

urlpatterns = [
    url('events/', events.EventView.as_view(), name='events'),
    url('venues/', venues.VenueView.as_view(), name='venues'),
]
