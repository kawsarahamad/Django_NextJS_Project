from django.views.decorators.csrf import csrf_exempt
import json
from django.contrib import messages
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import AuthenticationForm
from django.views import View
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator


from django.views.generic import TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin

# Create your views here.
from rest_framework.generics import ListCreateAPIView

from resultapp.admin import ResultForm


from .forms import LoginForm
from .models import Result, Student, Department, Course, Semester
from .serializers import ResultSerializer, StudentSerializer, DepartmentSerializer, CourseSerializer, SemesterSerializer



def landing_page(request):
    return render(request, 'landing_page.html')


class DashboardView(LoginRequiredMixin, TemplateView):
    template_name = 'dashboard.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        student = self.request.user

        results = Result.objects.filter(student=student).select_related('course', 'semester')
        grade_mapping = {
            'A+': 4.0,
            'A': 3.75,
            'A-': 3.5,
            'B+': 3.25,
            'B': 3.0,
            'C+': 2.5,
            'C': 2.0,
            'D': 1.0,
            'F': 0.0,
        }

        semesters = {}
        for result in results:
            semester = result.semester
            if semester not in semesters:
                semesters[semester] = {'total_grade_points': 0, 'total_credits': 0}
            
            grade_point = grade_mapping[result.grade] * float(result.course.credit)
            semesters[semester]['total_grade_points'] += grade_point
            semesters[semester]['total_credits'] += result.course.credit

        semester_gpas = {}
        for semester, data in semesters.items():
            total_grade_points = data['total_grade_points']
            total_credits = data['total_credits']
            gpa = total_grade_points / float(total_credits) if total_credits > 0 else 0
            semester_gpas[semester] = gpa

        total_grade_points = sum(data['total_grade_points'] for data in semesters.values())
        total_credits = sum(data['total_credits'] for data in semesters.values())
        cgpa = total_grade_points / float(total_credits) if total_credits > 0 else 0

        context['student'] = student
        context['results'] = results
        context['semester_gpas'] = semester_gpas
        context['cgpa'] = cgpa

        return context



@login_required
def DashboardDataView(request):
    student = request.user
    print (student)
    results = Result.objects.filter(student=student).select_related('course', 'semester')
    grade_mapping = {
        'A+': 4.0,
        'A': 3.75,
        'A-': 3.5,
        'B+': 3.25,
        'B': 3.0,
        'C+': 2.5,
        'C': 2.0,
        'D': 1.0,
        'F': 0.0,
    }

    semesters = {}
    for result in results:
        semester = result.semester
        if semester not in semesters:
            semesters[semester] = {'total_grade_points': 0, 'total_credits': 0}
        
        grade_point = grade_mapping[result.grade] * float(result.course.credit)
        semesters[semester]['total_grade_points'] += grade_point
        semesters[semester]['total_credits'] += result.course.credit

    semester_gpas = {}
    for semester, data in semesters.items():
        total_grade_points = data['total_grade_points']
        total_credits = data['total_credits']
        gpa = total_grade_points / float(total_credits) if total_credits > 0 else 0
        semester_gpas[semester.semester_number] = {
            'semester_number': semester.semester_number,
            'gpa': gpa
        }

    total_grade_points = sum(data['total_grade_points'] for data in semesters.values())
    total_credits = sum(data['total_credits'] for data in semesters.values())
    cgpa = total_grade_points / float(total_credits) if total_credits > 0 else 0

    data = {
        'student': {
            'first_name': student.first_name,
            'last_name': student.last_name,
        },
        'results': [
            {
                'course_name': result.course.name,
                'course_code': result.course.code,
                'grade': result.grade,
                'semester_number': result.semester.semester_number
            }
            for result in results
        ],
        'semester_gpas': semester_gpas,
        'cgpa': cgpa,
    }

    return JsonResponse(data)








# @method_decorator(ensure_csrf_cookie, name='dispatch')
# class CustomLoginView(View):
#     def get(self, request):
#         form = AuthenticationForm()
#         return render(request, 'login.html', {'form': form})
    
#     def post(self, request):
#         form = AuthenticationForm(request, request.POST)
#         if form.is_valid():
#             username = form.cleaned_data.get('username')
#             password = form.cleaned_data.get('password')
#             user = authenticate(request, username=username, password=password)
#             if user is not None:
#                 login(request, user)
#                 return redirect('dashboard') 
#             else:
#                 form.add_error(None, 'Invalid credentials')
#         else:
#             print(form.errors)
        
#         return render(request, 'login.html', {'form': form})


@method_decorator(csrf_exempt, name='dispatch')
class CustomLoginView(View):
    def get(self, request):
        form = AuthenticationForm()
        return render(request, 'login.html', {'form': form})


    def post(self, request):
        try:
            data = json.loads(request.body)
            form = AuthenticationForm(request, data)
            if form.is_valid():
                username = form.cleaned_data.get('username')
                password = form.cleaned_data.get('password')
                user = authenticate(request, username=username, password=password)
                if user is not None:
                    login(request, user)
                    return JsonResponse({'success': True, 'message': 'Login successful'})
                else:
                    return JsonResponse({'success': False, 'message': 'Invalid credentials'}, status=401)
            else:
                return JsonResponse({'success': False, 'errors': form.errors}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'message': 'Invalid JSON'}, status=400)

    

class CustomLogoutView(View):
    def get(self, request):
        logout(request)
        return JsonResponse({'success': True, 'message': 'Logged out successfully'})
# @ensure_csrf_cookie
# def custom_login(request):
#     if request.method == 'POST':
#         form = AuthenticationForm(request, request.POST)
#         if form.is_valid():
#             username = form.cleaned_data.get('username')
#             password = form.cleaned_data.get('password')
#             user = authenticate(request, username=username, password=password)
#             if user is not None:
#                 login(request, user)
#                 return redirect('dashboard') 
#             else:
#                 form.add_error(None, 'Invalid credentials')
#         else:
#             print(form.errors)  
#     else:
#         form = AuthenticationForm()
    
#     return render(request, 'login.html', {'form': form})


# def custom_logout(request):
#     logout(request)
#     return redirect('landing_page')  




class ResultListCreate(ListCreateAPIView):
    queryset = Result.objects.all()
    serializer_class = ResultSerializer


class StudentListCreate(ListCreateAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

class DepartmentListCreate(ListCreateAPIView):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer

class CourseListCreate(ListCreateAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

class SemesterListCreate(ListCreateAPIView):
    queryset = Semester.objects.all()
    serializer_class = SemesterSerializer

