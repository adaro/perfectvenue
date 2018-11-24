from django.shortcuts import HttpResponse
from django.shortcuts import redirect, render
from django.views.generic import View
from django.contrib.sessions.models import Session
from perfectvenue import settings
import json

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
            Session.objects.get(session_key=params['sessionKey'])
            return HttpResponse(json.dumps({'loggedIn': True}),
                                content_type="application/json")
        except (Session.DoesNotExist, KeyError):
            return HttpResponse(json.dumps({'loggedIn': False}), content_type="application/json")


class RedirectView(View):
    def get(self, request):
        return redirect('{}?session_key={}'.format(settings.HOSTS[settings.ENV]['client'], request.session.session_key))
