# Generated by Django 5.0.6 on 2024-06-30 07:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('resultapp', '0002_rename_roll_number_student_student_id_student_email_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='student',
            name='last_login',
            field=models.DateTimeField(auto_now=True),
        ),
    ]
