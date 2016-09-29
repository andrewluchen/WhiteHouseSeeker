from django.conf.urls import include, url

from django.contrib import admin
admin.autodiscover()

from usgs import auth
from usgs import views

apipatterns = [
    url(r'^capitol/$', views.Capitol.as_view(), name='capitol'),
    url(r'^bill/new/$', views.Bill.newbill, name='new-bill'),
]

urlpatterns = [
    url(r'^auth/register/$', auth.user_register, name='register'),
    url(r'^auth/login/$', auth.user_login, name='login'),
    url(r'^auth/logout/$', auth.user_logout, name='logout'),
    url(r'^api/', include(apipatterns)),
    url(r'^echo/$', views.echo, name='echo'),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^', views.index, name='index'),
]
