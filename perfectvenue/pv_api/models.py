# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save
from django.forms.models import model_to_dict
from django.dispatch import receiver
from datetime import timedelta, datetime
from dateutil.parser import parse
import pytz

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
    photo = models.URLField(blank=True, null=True)
    coordinators = models.ManyToManyField(User)  # venue coords

    def __str__(self):
        return self.name


class Space(models.Model):

    venue = models.ForeignKey(Venue, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    description = models.TextField()
    photo = models.URLField(blank=True, null=True)

    @classmethod
    def daterange(cls, date1, date2):
        for n in range(int((date2 - date1).days) + 1):
            yield date1 + timedelta(n)

    # TODO: Optimize this call
    @classmethod
    def get_spaces_by_date(cls, venue_object, start_date, duration):

        if duration == 'null':
            duration = 1
        try:
            starttime_object = parse(str(start_date))
            endtime_object = parse(str(start_date)) + timedelta(minutes=int(duration))

        except Exception, error:
            #TODO: handle invalid datesd
            print error
            starttime_object = datetime.utcnow().replace(tzinfo=pytz.utc)

        spaces = []
        events = Event.objects.filter(venue=venue_object).exclude(status='DC')
        print events
        if events.exists():
            for event in events:
                print starttime_object, event.start_date, event.end_date
                if event.start_date.astimezone(pytz.utc) <= starttime_object <= event.end_date.astimezone(pytz.utc) or \
                   event.start_date.astimezone(pytz.utc) <= starttime_object + timedelta(minutes=int(duration)) <= event.end_date.astimezone(pytz.utc):
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

        if not spaces:
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
    num_guests = models.IntegerField(default=1)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    notes = models.TextField(blank=True, null=True)
    status = models.CharField(choices=STATUSES, max_length=200, blank=True, null=True, default='PN')
    coordinators = models.ManyToManyField(User, related_name='event_coordinators') # event coords

    def get_json(self):
        return {
            'id': self.pk,
            'name': self.name,
            'user': self.user.email,
            'venue': self.venue.id,
            'start_date': str(self.start_date),
            'end_date': str(self.end_date),
            'notes': self.notes,
            'status': self.status,
            'coordinators': [{'id': c.id, 'email': c.email} for c in self.coordinators.all()],
            'spaces': [{'id': s.id, 'name': s.name} for s in self.spaces.all()]
        }

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
            return '{} ({} to {})'.format(self.name, self.start_date, self.end_date)
        else:
            return '{}'.format(self.name)


@receiver(post_save, sender=Event, dispatch_uid="event_created")
def send_notification(sender, instance, created, **kwargs):
    # syntax - notify.send(actor, recipient, verb, action_object, target, level, description, public, timestamp, **kwargs)
    # TODO: look into setting content type field on the notification rather than using str sub
    if created:
        print 'Created Event. Sending Message to Venue Coordinator'
        notify.send(instance, recipient=instance.venue.coordinators.all(), verb='{} requested a booking / {}-{}'.format(instance.user.username, instance.venue.id, instance.id))
    else:
        print 'Updated Event. Sending Message to Event Coordinator'
        notify.send(instance, recipient=instance.coordinators.all(), verb='{} updated a booking / {}-{}'.format(instance.user.username, instance.venue.id, instance.id))
