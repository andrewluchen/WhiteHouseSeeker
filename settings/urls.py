from django.conf.urls import include, url

from django.contrib import admin
admin.autodiscover()

from machina.app import board

urlpatterns = [
    url(r'^admin/', include(admin.site.urls)),

    # Machina
    url(r'^markdown/', include( 'django_markdown.urls')),
    url(r'^forum/', include(board.urls)),
    url(r'^', include('usgs.urls')),
]
