from django.conf.urls import url
from pv_api.views import events, venues, spaces, notifications
from django.views.decorators.csrf import csrf_exempt

urlpatterns = [
    url('events/create/$',  csrf_exempt(events.CreateEventView.as_view()), name='events'),
    url('events/$', events.EventView.as_view(), name='events'),
    url('events/(?P<event_id>\w+)/$', csrf_exempt(events.EventView.as_view()), name='event'),
    url('events/(?P<event_id>\w+)/created/$', csrf_exempt(events.CreatedEventView.as_view()), name='venues.created'),

    url('venues/$', venues.VenueView.as_view(), name='venues'),
    url('venues/(?P<venue_id>\w+)/created/$', csrf_exempt(venues.CreatedVenueView.as_view()), name='venues.created'),

    url('venues/add/$', venues.AddVenue.as_view(), name='venues.add'),
    url('venues/(?P<venue_id>\w+)/$', venues.VenueView.as_view(), name='venue'),

    url('venues/(?P<venue_id>\w+)/$', venues.VenueView.as_view(), name='venue'),

    url('spaces/$', spaces.SpaceView.as_view(), name='spaces'),
    url('spaces/(?P<space_id>\w+)/$', spaces.SpaceView.as_view(), name='space'),

    url('notifications/unread/$', notifications.UnreadNotificationView.as_view(), name='notifications.unread'),
    url('notifications/(?P<user_id>\w+)/unread/$', notifications.UnreadNotificationView.as_view(), name='notification.unread'),
    url('notifications/(?P<user_id>\w+)/unread/(?P<notification_id>\w+)/$', csrf_exempt(notifications.UnreadNotificationView.as_view()), name='notification.markread'),
    url('notifications/read/$', notifications.ReadNotificationView.as_view(), name='notifications.read'),
    url('notifications/(?P<user_id>\w+)/read/$', notifications.ReadNotificationView.as_view(), name='notification.read'),
]
