# Generated by Django 3.2.6 on 2021-08-22 15:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_alter_user_duel_code'),
    ]

    operations = [
        migrations.AlterField(
            model_name='trackcodes',
            name='code1',
            field=models.CharField(default='', max_length=50, unique=True),
        ),
        migrations.AlterField(
            model_name='trackcodes',
            name='code2',
            field=models.CharField(default='', max_length=50, unique=True),
        ),
    ]
