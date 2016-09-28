from django.conf.urls import include, url

from usgs import views

apipatterns = [
    url(r'^capitol/$', views.Capitol.as_view(), name='capitol'),
    url(r'^bill/new/$', views.NewBill.as_view(), name='new-bill'),
]

urlpatterns = [
    url(r'^api/', include(apipatterns)),
    url(r'^echo/$', views.echo, name='echo'),
    url(r'^', views.index, name='index'),
]
