# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    is_event_coordinator = models.BooleanField('event coordinator status', default=False)
    is_venue_coordinator = models.BooleanField('venue coordinator status', default=False)


class Venue(models.Model):
    name = models.CharField(max_length=200)
    address = models.TextField()
    description = models.TextField()
    occupancy = models.IntegerField()
    parking_notes = models.TextField()
    logo = models.URLField()

    def search_venue(self, query_string):
        return self.objects.filter(name=query_string)


class Space(models.Model):
    STATUSES = (
        ('BK', 'BOOKED'),
        ('OP', 'OPEN')
    )
    venue = models.ForeignKey(Venue, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    status = models.CharField(choices=STATUSES, max_length=200)


    # TODO: will need to have a way to set 'required' if certain date is set

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
    venue = models.ForeignKey(Venue, on_delete=models.CASCADE)
    spaces = models.ManyToManyField(Space)
    date = models.DateTimeField()
    notes = models.TextField()
    status = models.CharField(choices=STATUSES, max_length=200)

    def book(self, venue_id, space_ids, date, notes):
        venue = Venue.objects.get(id=venue_id)
        booking = self.objects.create(venue=venue, date=date, notes=notes, status='PN')

        # TODO: function that checks to see if a particular Space ID requires sibling spaces to also be booked
        # TODO: based on time of year, [ ], [ ]
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
