# Generated by Django 2.1.1 on 2018-10-01 11:51

from django.db import migrations, models
import json
import os



def load_data(apps, schema_editor):

    print('>>>>>>>>> CUR DIR : %s' % os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    file_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '/../../'))
    print('>>>> FILE PATH : %s' % file_path)
    file_name = 'status_data.json'

    with open(os.path.join(file_path, file_name)) as f:
        data = json.load(f)

    Status = apps.get_model('card', 'Status')

    for item in data:
        Status.objects.create(id=item.get("id"),
                              name=item.get("fields").get("name"),
                              is_active=item.get("fields").get("is_actuve"),
                              order_num=item.get("fields").get("order_num"),
                              is_default=item.get("fields").get("is_default"))



class Migration(migrations.Migration):

    dependencies = [
        ('card', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Status',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=20, unique=True)),
                ('is_actuve', models.BooleanField(default=True)),
                ('order_num', models.IntegerField()),
                ('is_default', models.BooleanField(default=False)),
            ],
        ),
        migrations.RunPython(load_data),
    ]
