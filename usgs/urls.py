from django.conf.urls import include, url

from usgs import auth
from usgs import views

apipatterns = [
    url(r'^capitol/$', views.CapitolView.as_view(), name='power-players'),

    url(r'^user/(?P<pk>[0-9]+)/$', views.UserView.as_view(), name='user'),
    url(r'^character/new/$', views.NewCharacterView.as_view(), name='new-character'),
    url(r'^character/(?P<pk>[0-9]+)/$', views.CharacterView.as_view(), name='character'),
    url(r'^character/(?P<pk>[0-9]+)/votes/$', views.CharacterVotingRecordView.as_view(), name='character-voting-record'),
    url(r'^characters/$', views.CharactersView.as_view(), name='characters'),

    url(r'^bill/new/$', views.NewBillView.as_view(), name='new-bill'),
    url(r'^bill/(?P<pk>[0-9]+)/$', views.BillView.as_view(), name='bill'),
    url(r'^bill/(?P<bid>[0-9]+)/(?P<vid>[0-9]+)/$', views.BillVersionView.as_view(), name='bill-version'),
    url(r'^bills/$', views.BillsView.as_view(), name='get-bills'),
    url(r'^bills/versions/$', views.BillVersionsView.as_view(), name='get-bill-versions'),
    url(r'^vote/new/$', views.NewVoteView.as_view(), name='new-vote'),
    url(r'^vote/(?P<pk>[0-9]+)/$', views.VoteView.as_view(), name='vote'),
    url(r'^votes/$', views.VotesView.as_view(), name='get-votes'),
    url(r'^debate/new/$', views.NewDebateView.as_view(), name='new-debate'),
    url(r'^debate/(?P<pk>[0-9]+)/$$', views.DebateView.as_view(), name='debate'),
    url(r'^debate/motion/(?P<pk>[0-9]+)/$', views.DebateMotionView.as_view(), name='debate-motion'),
    url(r'^debates/$', views.DebatesView.as_view(), name='get-debates'),
]

urlpatterns = [
    url(r'^auth/echo/$', auth.user_echo, name='echo-user'),
    url(r'^auth/register/$', auth.user_register, name='register-user'),
    url(r'^auth/login/$', auth.user_login, name='login-user'),
    url(r'^auth/logout/$', auth.user_logout, name='logout-user'),
    url(r'^api/', include(apipatterns)),
    url(r'^echo/$', views.echo, name='echo'),
    url(r'^', views.Index.as_view(), name='index'),
]
