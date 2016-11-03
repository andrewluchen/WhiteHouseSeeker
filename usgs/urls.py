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
    url(r'^vote/officer/(?P<pk>[0-9]+)/$', views.VoteOfficerView.as_view(), name='vote-officer'),
    url(r'^votes/$', views.VotesView.as_view(), name='get-votes'),
    url(r'^debate/new/$', views.NewDebateView.as_view(), name='new-debate'),
    url(r'^debate/(?P<pk>[0-9]+)/$$', views.DebateView.as_view(), name='debate'),
    url(r'^debate/motion/(?P<pk>[0-9]+)/$', views.DebateMotionView.as_view(), name='debate-motion'),
    url(r'^debate/officer/(?P<pk>[0-9]+)/$', views.DebateOfficerView.as_view(), name='debate-officer'),
    url(r'^debates/$', views.DebatesView.as_view(), name='get-debates'),
    url(r'^election/new/$', views.NewElectionView.as_view(), name='new-election'),
    url(r'^election_day/(?P<pk>[0-9]+)/$', views.ElectionDayView.as_view(), name='election_day'),
    url(r'^election/(?P<pk>[0-9]+)/$', views.ElectionView.as_view(), name='election'),
    url(r'^elections/$', views.ElectionsView.as_view(), name='get-elections'),
    url(r'^campaign/(?P<pk>[0-9]+)/$', views.CampaignView.as_view(), name='campaign'),
    url(r'^campaign_day/(?P<pk>[0-9]+)/$', views.CampaignDayView.as_view(), name='campaign_day'),
    url(r'^warchest/(?P<pk>[0-9]+)/$', views.WarchestView.as_view(), name='warchest'),
]

urlpatterns = [
    url(r'^auth/echo/$', auth.user_echo, name='echo-user'),
    url(r'^auth/register/$', auth.user_register, name='register-user'),
    url(r'^auth/login/$', auth.user_login, name='login-user'),
    url(r'^auth/logout/$', auth.user_logout, name='logout-user'),
    url(r'^auth/password/$', auth.user_password, name='change-password'),
    url(r'^auth/email/$', auth.user_email, name='change-email'),
    url(r'^api/', include(apipatterns)),
    url(r'^echo/$', views.echo, name='echo'),
    url(r'^', views.Index.as_view(), name='index'),
]
