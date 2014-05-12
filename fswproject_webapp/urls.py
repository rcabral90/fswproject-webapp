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
    url(r'^add_resident/', 'com_fsw_webapp.views.add_resident', name='add_resident'),
    url(r'^alerts/', 'com_fsw_webapp.views.alert_page', name='alert_page'),
    url(r'^add_doctor/', 'com_fsw_webapp.views.add_doctor', name='add_doctor'),
    url(r'^logout/$', 'com_fsw_webapp.views.logout', name='logout'),
    url(r'^upload_photo/', 'com_fsw_webapp.views.upload_photo', name='upload_photo'),
    # url(r'^fswproject_webapp/', include('fswproject_webapp.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),
)
