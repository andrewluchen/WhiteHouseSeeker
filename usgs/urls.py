from django.conf.urls import include, url

from django.contrib import admin
admin.autodiscover()

from usgs import auth
from usgs import views

apipatterns = [
    url(r'^leaders/$', views.Leaders.as_view(), name='leaders'),
    url(r'^character/$', views.Character.as_view(), name='new-character'),
    url(r'^character/(?P<pk>[0-9]+)/$', views.Character.as_view(), name='view-character'),
    url(r'^characters/$', views.Characters.as_view(), name='characters'),
    url(r'^bill/$', views.Bill.as_view(), name='new-bill'),
    url(r'^bill/(?P<pk>[0-9]+)/$', views.Bill.as_view(), name='view-bill'),
    # url(r'^bills/$', views.Bill.as_view(), name='bills'),
]

urlpatterns = [
    url(r'^auth/echo/$', auth.user_echo, name='echo-user'),
    url(r'^auth/register/$', auth.user_register, name='register-user'),
    url(r'^auth/login/$', auth.user_login, name='login-user'),
    url(r'^auth/logout/$', auth.user_logout, name='logout-user'),
    url(r'^api/', include(apipatterns)),
    url(r'^echo/$', views.echo, name='echo'),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^', views.index, name='index'),
]
