# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save
from django.forms.models import model_to_dict

from django.dispatch import receiver

from notifications.signals import notify
import pprint

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
    photo = models.URLField(blank=True, null=True)
    coordinators = models.ManyToManyField(User)  # venue coords

    def __str__(self):
        return self.name


class Space(models.Model):

    venue = models.ForeignKey(Venue, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    description = models.TextField()
    photo = models.URLField(blank=True, null=True)

    # TODO: Optimize this call
    @classmethod
    def get_spaces(cls, venue_object, start_date, end_date):
        events = Event.objects.filter(venue=venue_object, start_date__gte=start_date, end_date__lte=end_date)
        spaces = []
        if events.exists():
            for event in events:
                all_booked = bool(set(event.spaces.all()) == set(Space.objects.filter(venue=venue_object)))
                available_set = list(set(Space.objects.filter(venue=venue_object)) - set(event.spaces.all()))
                available = []
                for i in available_set:
                    available.append(model_to_dict(i))
                space = {
                    'event': event.id,
                    'booked': list(event.spaces.all().values()),
                    'available': available,
                    'all_booked': all_booked,
                 }
                spaces.append(space)
        else:
            spaces_object = Space.objects.filter(venue=venue_object)
            space = {'event': None, 'booked': [], 'available': list(spaces_object.values()), 'all_booked': False}
            spaces.append(space)

        booked_spaces = []
        available_spaces = []
        for space in spaces:
            for book in space['booked']:
                if book not in booked_spaces:
                    booked_spaces.append(book)
            booked_spaces_ids = [int(i['id']) for i in booked_spaces]
        for space in spaces:
            for avail in space['available']:
                if avail not in available_spaces and avail['id'] not in booked_spaces_ids:
                    available_spaces.append(avail)

        print pprint.pprint( {"booked": booked_spaces, "available": available_spaces})
        return {"booked": booked_spaces, "available": available_spaces}



    def __str__(self):
        return "{} - {}".format(self.venue.name, self.name)


class Event(models.Model):
    STATUSES = (
        ('AP', 'APPROVED'),
        ('PN', 'PENDING'),
        ('DC', 'DECLINED'),
        ('CN', 'CANCELED'),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE) # user who created the event
    name = models.CharField(max_length=200)
    venue = models.ForeignKey(Venue, on_delete=models.CASCADE)
    spaces = models.ManyToManyField(Space)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    notes = models.TextField(blank=True, null=True)
    status = models.CharField(choices=STATUSES, max_length=200, blank=True, null=True, default='PN')
    coordinators = models.ManyToManyField(User, related_name='event_coordinators') # event coords

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
def send_notification(sender, instance, created, **kwargs):
    # syntax - notify.send(actor, recipient, verb, action_object, target, level, description, public, timestamp, **kwargs)
    if created:
        print 'Created Event. Sending Message to Event Coordinator'
        notify.send(instance, recipient=instance.venue.coordinators.all(), verb='{} requested a booking'.format(instance.user.username))
    else:
        print 'Updated Event. Sending Message to Event Coordinator'
        notify.send(instance, recipient=instance.coordinators.all(), verb='{} updated a booking'.format(instance.user.username))
