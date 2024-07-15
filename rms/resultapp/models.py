# results/models.py
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.contrib.auth.hashers import make_password
from dirtyfields import DirtyFieldsMixin
from django.core.exceptions import ValidationError


class Department(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Course(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=10)
    credit = models.DecimalField(max_digits=3, decimal_places=2,default=3.00)
    is_theory = models.BooleanField(default=True)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)

    def __str__(self):
        return self.name
    
    def clean(self):
        super().clean()
        if self.credit < 0.75 or self.credit > 4.00:
            raise ValidationError({'credit': 'Credit must be between 0.75 and 4.00.'})


class MyUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)

class Student(AbstractBaseUser):
    student_id = models.CharField(max_length=10, unique=True)
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    password = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = MyUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'student_id', 'department']

    def __str__(self):
        return self.student_id

    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, app_label):
        return True


class Semester(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='semesters')
    course = models.ForeignKey(Course,on_delete=models.CASCADE,default=1)
    semester_number = models.PositiveIntegerField()
    

    class Meta:
        unique_together = ('student', 'semester_number', 'course')

    def __str__(self):
        return f"{self.student} - {self.semester_number} - {self.course}"

class Result(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='results')
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    semester = models.ForeignKey(Semester, on_delete=models.CASCADE)
    grade = models.CharField(max_length=2)

    class Meta:
        unique_together = ('student', 'course', 'semester')

    def __str__(self):
        return f"{self.student} - {self.course} - {self.grade}"
    
    def clean(self):
        super().clean()
        if self.grade not in ['A+', 'A', 'A-', 'B+', 'B', 'C+', 'C', 'D', 'F']:
            raise ValidationError({'grade': 'Invalid grade.'})

        enrolled_semesters = self.student.semesters.all()
        if self.semester not in enrolled_semesters:
            raise ValidationError({'semester': 'Invalid semester selection. Student is not enrolled in this semester.'})
            
           
        