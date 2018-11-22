# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core import serializers
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.shortcuts import get_object_or_404

from notifications.signals import notify


class User(AbstractUser):
    is_event_coordinator = models.BooleanField('event coordinator status', default=False)
    is_venue_coordinator = models.BooleanField('venue coordinator status', default=False)


class Venue(models.Model):
    name = models.CharField(max_length=200)
    address = models.TextField()
    description = models.TextField()
    occupancy = models.IntegerField(blank=True, null=True)
    parking_notes = models.TextField(blank=True, null=True)
    logo = models.URLField(blank=True, null=True)
    coordinators = models.ManyToManyField(User)

    def search_venue(self, query_string):
        return self.objects.filter(name=query_string)

    def __str__(self):
        return self.name


class Space(models.Model):

    venue = models.ForeignKey(Venue, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)

    # TODO: this method should be checking to see if there is an event with this space for a given date
    # TODO: query event by start and end date
    # TODO: if queried event has space, return as "booked" else return as "available"

    @classmethod
    def get_spaces(cls, venue_object, start_date, end_date):
        events = Event.objects.filter(venue=venue_object, start_date__gte=start_date, end_date__lte=end_date)
        spaces = []
        if events.exists():
            for event in events:
                space = {'event': event.id, 'booked': list(event.spaces.all().values()), 'available': []}
                spaces.append(space)
        else:
            event = Event.objects.filter(venue=venue_object).first()
            space = {'event': None, 'booked': [], 'available': list(event.spaces.all().values())}
            spaces.append(space)

        print 'GOT OUR SPACES.....', spaces
        return spaces

    def __str__(self):
        return "{} - {}".format(self.venue.name, self.name)


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
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    notes = models.TextField(blank=True, null=True)
    status = models.CharField(choices=STATUSES, max_length=200)
    coordinators = models.ManyToManyField(User)

    def get_spaces(self):
        return self.spaces

    def book(self, venue_id, space_ids, start_date, end_date, notes):
        venue = Venue.objects.get(id=venue_id)
        booking = self.objects.create(venue=venue, start_date=start_date, end_date=end_date, notes=notes, status='PN')
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

    def __str__(self):
        if self.start_date and self.end_date:
            return '{} ({} to {})'.format(self.name, self.start_date.date(), self.end_date.date())
        else:
            return '{}'.format(self.name)


@receiver(post_save, sender=Event, dispatch_uid="event_created")
def send_notification(sender, instance, **kwargs):
     print 'Sending Notification'
     # syntax - notify.send(actor, recipient, verb, action_object, target, level, description, public, timestamp, **kwargs)
     notify.send(instance, recipient=instance.venue.coordinators.all(), verb='Event was saved')