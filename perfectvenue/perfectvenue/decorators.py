from django.core.exceptions import PermissionDenied, ObjectDoesNotExist
from pv_api.models import User
from django.shortcuts import HttpResponse
import json

def pv_authentication(function):
    def wrap(request, *args, **kwargs):
        uid = None

        if request.method == 'GET':
            uid = request.GET.get('pvuid')
        if request.method == 'POST':
            uid = json.loads(request.body)['params']['pvuid']
        if request.method == 'PUT':
            uid = json.loads(request.body)['params']['pvuid']

        try:
            user = User.objects.get(pk=uid)
            if user.is_authenticated():
                return function(request, *args, **kwargs)
            else:
                raise PermissionDenied
        except Exception, error:
            print error
            return HttpResponse({'authenticated': False },  content_type="application/json", status=401)

    wrap.__doc__ = function.__doc__
    wrap.__name__ = function.__name__
    return wrap