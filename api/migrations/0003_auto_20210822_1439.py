# Generated by Django 3.2.6 on 2021-08-22 14:39

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_genre_magneta_model'),
    ]

    operations = [
        migrations.CreateModel(
            name='TrackCodes',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code1', models.CharField(max_length=20, unique=True)),
                ('code2', models.CharField(max_length=20, unique=True)),
                ('duel', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.duel')),
            ],
        ),
        migrations.DeleteModel(
            name='Track',
        ),
    ]
