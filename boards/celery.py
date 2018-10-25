from __future__ import absolute_import, unicode_literals
from celery import Celery

app = Celery('boards',
             broker='redis://localhost:6379/0',
             backend='redis://localhost:6379/0',
             include=['boards.tasks'])

@app.task
def add(x, y):
    return x + y

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