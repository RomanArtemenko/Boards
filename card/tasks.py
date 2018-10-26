from boards.celery import app
from celery import Task


@app.task
def task_card(x, y):
    return 'Task from card : %s' % x * y

@app.task
def notify_performer(username='You'):
    return '%s , you have new task' % username

class NotifyPerformer(Task):

    def run(self, msg, *args, **kwargs):
        print('My first CBT !')
        print(msg)
        print('>>> END <<<')

