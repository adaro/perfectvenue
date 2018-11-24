from django.contrib.auth import login
from django.shortcuts import redirect, render
from django.views.generic import View
from perfectvenue import settings

class SignUpView(View):

    def get(self, request, *args, **kwargs):
        return render(request, 'registration/sign-up.html', *args, **kwargs)


class LoginView(View):
    def get(self, request, *args, **kwargs):
        return render(request, 'registration/login.html', *args, **kwargs)


class RedirectView(View):
    def get(self, request, *args, **kwargs):
        print request.session.session_key
        return redirect(settings.HOSTS[settings.ENV]['client'])
