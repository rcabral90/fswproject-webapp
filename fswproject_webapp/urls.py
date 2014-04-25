from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    url(r'^$', 'com_fsw_webapp.views.home', name='home'),
	url(r'^selector/$', 'com_fsw_webapp.views.selector', name='selector'),
	url(r'^search/$', 'com_fsw_webapp.views.search', name='search'),
    url(r'^login/$', 'com_fsw_webapp.views.login', name='login'),
    # url(r'^fswproject_webapp/', include('fswproject_webapp.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),
)
