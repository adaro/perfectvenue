# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

from django.db import models
from django.conf import settings


class Venue(models.Model):
    name = models.CharField(max_length=200)
    address = models.TextField()
    description = models.TextField()
    hours_of_operation = models.CharField(default="9:00 AM to 5:00 PM", max_length=200)
    days_available = models.CharField(default="Monday through Friday", max_length=200)
    occupancy = models.IntegerField()
    parking_notes = models.TextField()
    logo = models.URLField()

    def search_event(self, query_string):
        return self.objects.filter(name=query_string)


class Space(models.Model):
    STATUSES = (
        ('BK', 'BOOKED'),
        ('OP', 'OPEN')
    )
    venue = models.ForeignKey(Venue)
    name = models.CharField(max_length=200)
    status = models.CharField(choices=STATUSES, max_length=200)

    def is_open(self):
        return self.status == 'OP'

    def is_booked(self):
        return self.status == 'BK'


class Event(models.Model):
    STATUSES = (
        ('AP', 'APPROVED'),
        ('PN', 'PENDING'),
        ('DC', 'DECLINED'),
        ('CN', 'CANCELED'),
    )
    name = models.CharField(max_length=200)
    user = models.ForeignKey(settings.AUTH_USER_MODEL)
    venue = models.ForeignKey(Venue, )
    spaces = models.ManyToManyField(Space)
    date = models.DateTimeField()
    notes = models.TextField()
    status = models.CharField(choices=STATUSES, max_length=200)

    def book(self, venue_id, space_ids, date, notes):
        venue = Venue.objects.get(id=venue_id)
        booking = self.objects.create(venue=venue, date=date, notes=notes, status='PN')
        for spid in space_ids:
            space = Space.objects.get(id=spid)
            booking.spaces.add(space)

    def cancel(self, event_id):
        event = self.objects.get(id=event_id)
        event.status = 'CN'
        event.save()

    def is_pending(self):
        return self.status == 'PN'

    def is_approved(self):
        return self.status == 'AP'

    def is_declined(self):
        return self.status == 'DC'

    def is_cancelled(self):
        return self.status == 'CN'
