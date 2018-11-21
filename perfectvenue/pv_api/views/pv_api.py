from django.contrib.auth import login
from django.shortcuts import redirect, render
from django.views.generic import View


class SignUpView(View):
    
    def get(self, request, *args, **kwargs):
        return render(request, 'registration/sign-up.html', *args, **kwargs)