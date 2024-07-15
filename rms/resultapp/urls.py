from django.urls import include, path
from .views import CustomLoginView, CustomLogoutView, DashboardDataView, DashboardView, ResultListCreate, StudentListCreate, DepartmentListCreate, CourseListCreate, SemesterListCreate,landing_page
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi


schema_view = get_schema_view(
   openapi.Info(
      title="Result Management System API",
      default_version="v1",
      description="API for managing results of students",
      terms_of_service="https://www.google.com/policies/terms/",
      contact=openapi.Contact(email="contact@example.com"),
      license=openapi.License(name="MIT License"),
   ),
   public=True,
)

urlpatterns = [
    path('', landing_page, name='landing_page'),
    path('results/', ResultListCreate.as_view(), name='result-list-create'),
    path('students/', StudentListCreate.as_view(), name='student-list-create'),
    path('departments/', DepartmentListCreate.as_view(), name='department-list-create'),
    path('courses/', CourseListCreate.as_view(), name='course-list-create'),
    path('semesters/', SemesterListCreate.as_view(), name='semester-list-create'),
    path('accounts/login/',CustomLoginView.as_view(), name='login'),
    path('accounts/logout/', CustomLogoutView.as_view(), name='logout'),
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
    path('dashboard-data/',DashboardDataView, name='dashboard-data'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),

]