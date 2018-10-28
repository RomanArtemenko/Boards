from boards.celery import app


@app.task
def task_auth(x, y):
    return 'Task from auth : %s' % x + y
