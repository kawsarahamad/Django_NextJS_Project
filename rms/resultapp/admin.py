from django.contrib import messages
from django.contrib import admin
from django.shortcuts import redirect, render
from django.urls import path


from resultapp.forms import ResultForm
from .models import Result, Student, Department, Course, Semester
from django import forms
from django.contrib import admin
from .models import Result, Student


class ResultAdmin(admin.ModelAdmin):
    form = ResultForm
    list_display = ('student', 'course', 'semester', 'grade')
    
    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
    

admin.site.register(Result, ResultAdmin)
admin.site.register(Student)
admin.site.register(Department)
admin.site.register(Course)
admin.site.register(Semester)


# Register your models here.
