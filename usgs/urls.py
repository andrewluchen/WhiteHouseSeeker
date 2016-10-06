from django.conf.urls import include, url

from django.contrib import admin
admin.autodiscover()

from usgs import auth
from usgs import views

apipatterns = [
    url(r'^leaders/$', views.Leaders.as_view(), name='leaders'),
    url(r'^character/new/$', views.NewCharacterView.as_view(), name='new-character'),
    url(r'^character/(?P<pk>[0-9]+)/$', views.CharacterView.as_view(), name='character'),
    url(r'^characters/$', views.CharactersView.as_view(), name='characters'),
    url(r'^bill/new/$', views.NewBillView.as_view(), name='new-bill'),
    url(r'^bill/(?P<pk>[0-9]+)/$', views.BillView.as_view(), name='bill'),
    url(r'^bill/(?P<bid>[0-9]+)/(?P<vid>[0-9]+)/$', views.BillVersionView.as_view(), name='bill-version'),
    url(r'^bills/$', views.BillsView.as_view(), name='bills'),
    url(r'^clerk/$', views.ClerkView.as_view(), name='clerk'),
    url(r'^vote/(?P<pk>[0-9]+)/$', views.VoteView.as_view(), name='vote'),
    url(r'^votes/$', views.VotesView.as_view(), name='votes'),
]

urlpatterns = [
    url(r'^auth/echo/$', auth.user_echo, name='echo-user'),
    url(r'^auth/register/$', auth.user_register, name='register-user'),
    url(r'^auth/login/$', auth.user_login, name='login-user'),
    url(r'^auth/logout/$', auth.user_logout, name='logout-user'),
    url(r'^api/', include(apipatterns)),
    url(r'^echo/$', views.echo, name='echo'),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^', views.Index.as_view(), name='index'),
]
