from __future__ import absolute_import, unicode_literals
import os
from celery import Celery

# app = Celery('boards',
#              broker='redis://localhost:6379/0',
#              backend='redis://localhost:6379/0',
#              include=['boards.tasks'])
#
# @app.task
# def add(x, y):
#     return x + y

# app = Celery('boards',
#              broker='redis://localhost:6379/0',
#              backend='redis://localhost:6379/0',
#              include=['boards.tasks'])
#
# # Optional configuration, see the application user guide.
# app.conf.update(
#     result_expires=3600,
# )
#
# if __name__ == '__main__':
#     app.start()

# set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'boards.settings')

app = Celery('boards')

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys
#   should have a `CELERY_` prefix.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django app configs.
app.autodiscover_tasks()