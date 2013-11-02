from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()
from home import views

urlpatterns = patterns('',
    url(r'^$', views.hero, name='hero'),
    url(r'^login/$',  views.user_login, name='login'),
    url(r'^starter/', views.starter, name='starter'),
    url(r'^admin/', include(admin.site.urls))
    # url(r'^twitter/', include('twitter.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),
)
