"""perfectvenue URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.contrib import admin
from pv_api.views import events, venues, pv_api
import notifications.urls

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'api/', include('pv_api.urls', namespace='api')),
    url('accounts/', include('django.contrib.auth.urls')),
    url('accounts/select/', pv_api.SignUpView.as_view(), name='signup'),
    url('accounts/signup/venue_coordinator/', venues.CoordinatorSignUpView.as_view(), name='venue_coordinator_signup'),
    url('accounts/signup/event_coordinator/', events.CoordinatorSignUpView.as_view(), name='event_coordinator_signup'),
    url('^inbox/notifications/', include(notifications.urls, namespace='notifications')),
]
