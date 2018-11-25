from django.conf.urls import url
from pv_api.views import events, venues, spaces, notifications

urlpatterns = [
    url('events/$', events.EventView.as_view(), name='events'),
    url('events/(?P<event_id>\w+)/$', events.EventView.as_view(), name='event'),
    url('venues/$', venues.VenueView.as_view(), name='venues'),
    url('venues/add/$', venues.AddVenue.as_view(), name='venues.add'),
    url('venues/(?P<venue_id>\w+)/$', venues.VenueView.as_view(), name='venue'),
    url('spaces/$', spaces.SpaceView.as_view(), name='spaces'),
    url('spaces/(?P<space_id>\w+)/$', spaces.SpaceView.as_view(), name='space'),

    url('notifications/unread/$', notifications.UnreadNotificationView.as_view(), name='notifications.unread'),
    url('notifications/(?P<user_id>\w+)/unread/$', notifications.UnreadNotificationView.as_view(), name='notification.unread'),
    url('notifications/read/$', notifications.ReadNotificationView.as_view(), name='notifications.read'),
    url('notifications/(?P<user_id>\w+)/read/$', notifications.ReadNotificationView.as_view(), name='notification.read'),
]
