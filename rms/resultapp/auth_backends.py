from django.contrib.auth.backends import BaseBackend
from django.contrib.auth.hashers import check_password
from django.db.models import Q
from .models import Student

class StudentBackend(BaseBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        try:
            # Allow login with either student_id or email
            student = Student.objects.get(Q(student_id=username) | Q(email=username))
            if student and check_password(password, student.password):
                return student
        except Student.DoesNotExist:
            print('Student does not exist')
            return None

    def get_user(self, user_id):
        try:
            return Student.objects.get(pk=user_id)
        except Student.DoesNotExist:
            return None

