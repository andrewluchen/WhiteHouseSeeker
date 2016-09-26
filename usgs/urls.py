from django.conf.urls import include, url

import usgs.views

urlpatterns = [
    url(r'^$', usgs.views.index, name='index'),
]
