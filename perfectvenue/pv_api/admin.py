# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin
from pv_api.models import User, Venue, Event, Space


class UserAdmin(admin.ModelAdmin):
    pass


class VenueAdmin(admin.ModelAdmin):
    pass


class SpaceAdmin(admin.ModelAdmin):
    pass


class EventAdmin(admin.ModelAdmin):
    pass


admin.site.register(User, UserAdmin)
admin.site.register(Venue, VenueAdmin)
admin.site.register(Space, SpaceAdmin)
admin.site.register(Event, EventAdmin)