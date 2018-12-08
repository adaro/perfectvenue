from django.shortcuts import HttpResponse
from django.views.generic import View
from django.core import serializers
from ..models import User
import json

class UnreadNotificationView(View):
    def get(self, request, user_id=None):
        if user_id:
            user = User.objects.get(id=user_id)
            print user.notifications.unread()
            notifications = serializers.serialize("json", user.notifications.unread())
            return HttpResponse(notifications, content_type="application/json")

        print request.user.notifications.unread()
        notifications = serializers.serialize("json", request.user.notifications.unread())
        return HttpResponse(notifications, content_type="application/json")

    def put(self, request, user_id=None, notification_id=None):
        user = User.objects.get(id=int(user_id))
        notification_object = user.notifications.filter(id=int(notification_id))
        print notification_object
        notification_object[0].mark_as_read()
        return HttpResponse(json.dumps({"success": True}), content_type="application/json")


class ReadNotificationView(View):
    def get(self, request, user_id=None):
        if user_id:
            user = User.objects.get(id=user_id)
            user.notifications.read()
            notifications = serializers.serialize("json", user.notifications.read())
            return HttpResponse(notifications, content_type="application/json")

        print request.user.notifications.read()
        notifications = serializers.serialize("json", request.user.notifications.read())
        return HttpResponse(notifications, content_type="application/json")

    def post(self, request):
        index = request.body.get('index')
        #TODO: using index here but we probably want a better way to query the notification object
        notification_object = request.user.notifications.read()[index]
        notification_object.mark_as_read()
        return HttpResponse("", content_type="application/json")
