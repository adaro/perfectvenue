from django.shortcuts import HttpResponse
from django.views.generic import View
from ..models import User

class UnreadNotificationView(View):
    def get(self, request, user_id=None):
        if user_id:
            user = User.objects.get(id=user_id)
            print user.notifications.unread()
            return HttpResponse("", content_type="application/json")

        print request.user.notifications.unread()
        return HttpResponse("", content_type="application/json")

    def post(self, request):
        # TODO: using index here but we probably want a better way to query the notification object
        index = request.body.get('index')
        notification_object = request.user.notifications.read()[index]
        notification_object.mark_as_unread()
        return HttpResponse("", content_type="application/json")


class ReadNotificationView(View):
    def get(self, request, user_id=None):
        if user_id:
            user = User.objects.get(id=user_id)
            print user.notifications.read()
            return HttpResponse("", content_type="application/json")

        print request.user.notifications.read()
        return HttpResponse("", content_type="application/json")

    def post(self, request):
        index = request.body.get('index')
        #TODO: using index here but we probably want a better way to query the notification object
        notification_object = request.user.notifications.read()[index]
        notification_object.mark_as_read()
        return HttpResponse("", content_type="application/json")
