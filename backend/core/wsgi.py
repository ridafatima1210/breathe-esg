import os

from django.core.wsgi import get_wsgi_application

# Tells Django which settings file to load for the environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

# This is what Gunicorn hooks into (e.g., command: gunicorn core.wsgi:application)
application = get_wsgi_application()