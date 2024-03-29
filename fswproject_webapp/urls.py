from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()
from django.views.generic import RedirectView

urlpatterns = patterns('',
                       # Examples:
                       url(r'^$', 'com_fsw_webapp.views.home', name='home'),
                       url(r'^selector/$', 'com_fsw_webapp.views.selector', name='selector'),
                       url(r'^search/$', 'com_fsw_webapp.views.search', name='search'),
                       url(r'^login/$', 'com_fsw_webapp.views.login', name='login'),
                       url(r'^add_resident/', 'com_fsw_webapp.views.add_resident', name='add_resident'),
                       url(r'^alerts/', 'com_fsw_webapp.views.alert_page', name='alert_page'),
                       url(r'^logs/', 'com_fsw_webapp.views.log_page', name='log_page'),
                       url(r'^add_doctor/', 'com_fsw_webapp.views.add_doctor', name='add_doctor'),
                       url(r'^logout/$', 'com_fsw_webapp.views.logout', name='logout'),
                       url(r'^upload_photo/', 'com_fsw_webapp.views.upload_photo', name='upload_photo'),
                       url(r'^doctor_list/', 'com_fsw_webapp.views.edit_doctor_list', name='edit_doctor_list'),
                       url(r'^print_details/', 'com_fsw_webapp.views.print_page', name='print_page'),
                       (r'^admin_menu/$',
                        RedirectView.as_view(url='http://127.0.0.1:7177/admin/auth/user/')),
                       url(r'^feedback/thanks/', 'com_fsw_webapp.views.thanks'),
                       url(r'^feedback/', "com_fsw_webapp.views.feedback", name='contact'),
                       url(r'^about/', "com_fsw_webapp.views.about", name='contact'),
                       # url(r'^fswproject_webapp/', include('fswproject_webapp.foo.urls')),

                       # Uncomment the admin/doc line below to enable admin documentation:
                       # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

                       # Uncomment the next line to enable the admin:
                       # url(r'^admin/', include(admin.site.urls)),
)
