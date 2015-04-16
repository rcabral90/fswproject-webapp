from django.db import models

class AuthUser(object):
    def __init__(self, first_name, last_name, username, is_staff):
        self.first_name = first_name
        self.last_name = last_name
        self.username = username
        self.is_staff = is_staff
