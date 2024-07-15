from django import forms

from resultapp.models import Result, Student

class LoginForm(forms.Form):
    username = forms.CharField(label='Student ID or Email')
    password = forms.CharField(widget=forms.PasswordInput)


class ResultForm(forms.ModelForm):
    class Meta:
        model = Result
        fields = ['student', 'course', 'semester', 'grade']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['student'].queryset = Student.objects.all().order_by('student_id')
        self.fields['student'].label_from_instance = lambda obj: obj.student_id
