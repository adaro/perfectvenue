from django.conf.urls import url, include
from django.contrib import admin
from pv_api.views import events

urlpatterns = [
    url('^', events.HomeView.as_view(), name='home'),
]
