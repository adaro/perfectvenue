from django.shortcuts import HttpResponse
from django.shortcuts import redirect, render
from django.views.generic import View
from django.contrib.sessions.models import Session
from django.contrib.auth import login
from perfectvenue import settings
from ..models import User
import json

from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token

class SignUpView(View):
    def get(self, request, *args, **kwargs):
        return render(request, 'registration/sign-up.html', *args, **kwargs)


class LoginView(View):
    def get(self, request, *args, **kwargs):
        return render(request, 'registration/login.html', *args, **kwargs)

class AuthView(View):
    def post(self, request):
        params = json.loads(request.body).get('params')
        try:
            token = Token.objects.get(key=params['pvToken'])
            return HttpResponse(json.dumps({'loggedIn': True, 'userId': token.user.id, 'is_venue_coordinator': token.user.is_venue_coordinator}),
                                content_type="application/json")
        except (Token.DoesNotExist, KeyError):
            return HttpResponse(json.dumps({'loggedIn': False}), content_type="application/json")


class RedirectView(View):
    def get(self, request):
        token, created = Token.objects.get_or_create(user=request.user)
        return redirect('{}?pvToken={}'.format(settings.HOSTS[settings.ENV]['client'], token.key))


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)
