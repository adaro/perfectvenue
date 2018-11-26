from django.shortcuts import HttpResponse
from django.shortcuts import redirect, render
from django.views.generic import View
from django.contrib.sessions.models import Session
from django.contrib.auth import login
from perfectvenue import settings
from ..models import User
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
            user = User.objects.get(id=params['pvuid'])
            login(request, user)
            return HttpResponse(json.dumps({'loggedIn': True}),
                                content_type="application/json")
        except (User.DoesNotExist, KeyError):
            return HttpResponse(json.dumps({'loggedIn': False}), content_type="application/json")


class RedirectView(View):
    def get(self, request):
        print request.GET
        session = Session.objects.get(session_key=request.session.session_key)
        session_data = session.get_decoded()
        uid = session_data.get('_auth_user_id')
        return redirect('{}?uid={}'.format(settings.HOSTS[settings.ENV]['client'], uid))
