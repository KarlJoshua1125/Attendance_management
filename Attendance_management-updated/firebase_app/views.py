from django.shortcuts import render, redirect
from django.apps import apps
from django.http import JsonResponse
import firebase_admin
from firebase_admin import credentials, db
from .forms import StudentForm
from datetime import date
import pyrebase
from collections import Counter
def connectDB():
    if not firebase_admin._apps:
        cred = credentials.Certificate("studentmanagement-admin-key.json")
        firebase_admin.initialize_app(cred, {
            "databaseURL": "https://studentmanagement-84271-default-rtdb.firebaseio.com/"  # Your database URL
        })
    dbconn = db.reference("StudentsList")
    attendance_ref = db.reference("Attendance")
    section_ref = db.reference("Sections")
    return attendance_ref, dbconn, section_ref


def index(request):
    students = []
    sections = []
    _, dbconn, section_ref = connectDB()
    tblStudents = dbconn.get()
    tblSections = section_ref.get()

    for key, value in tblStudents.items():
        students.append({
            "id": int(value["ID"]),
            "fname": value["FirstName"],
            "lname": value["LastName"],
            "year": int(value["Year"]),
            "course": value["Course"],
            "section": value["Section"],
            "key": key
        })

    for key, value in tblSections.items():
        sections.append({
            "section": value["section"],
            "key": key
        })

    return render(request, 'index.html', {'students': students, 'sections': sections})


def homepage(request):
    return render(request, 'homepage.html')

def sections(request):
    sections = []
    attendance_ref, dbconn, section_ref = connectDB()
    tblSections = section_ref.get()
    print(tblSections)
    for key, value in tblSections.items():
        sections.append({"section": value["section"], "key": key})
    return render(request, 'sections.html', {'sections': sections})

def attendance(request):
    attendance_ref, dbconn, section_ref = connectDB()
    students = dbconn.get()
    dateInput = request.GET.get('date')

    attendance_record = None
    if dateInput:
        attendance_record = attendance_ref.child(dateInput).get()

    student_list = []
    for student_key in students.keys():
        student = students[student_key]
        student_list.append({
            'name': f"{student['FirstName']} {student['LastName']}",
            'id': student_key,
            'section': f"{student['Section']}",
            'img':f"{student['imgURL']}",
        })

    # Retrieve sections from the "Sections" collection
    sections = section_ref.get()
    section_list = []
    for section_key in sections.keys():
        section = sections[section_key]
        section_list.append({
            'section': section['section'],
        })

    attendance_list = []
    if attendance_record:
        for attendance_key in attendance_record.keys():
            att = attendance_record[attendance_key]
            att_id = att['Name'].replace(" ", "_")
            attendance_list.append({
                'att_name': f"{att['Name']}",
                'attendance': f"{att['Attendance']}",
                'att_section': f"{att['Section']}",
                'img': f"{att['Image']}",
                'att_IDname': att_id,
                'key': attendance_key
            })

    context = {
        'current_date': date.today().strftime("%Y-%m-%d"),
        'students': student_list,
        'attendance': attendance_list,
        'sections': section_list,  # Add sections to the context
    }
    return render(request, 'attendance.html', context)

def update_attendance(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest' and request.method == 'POST':
        attendanceStatus = request.POST.get('attendanceStatus')
        attendanceKey = request.POST.get('attendanceKey')
        dateInput = request.POST.get('dateInput')
        attendance_ref, _, _ = connectDB()
        attendance_ref.child(dateInput).child(attendanceKey).update({"Attendance": attendanceStatus})

        return JsonResponse({'status': 'success'})
    else:
        return JsonResponse({'status': 'errors', 'errors': 'Unable to update student.'})


def deletestudent(request, id):
    attendance_ref, dbconn, _ = connectDB()
    tblStudents = dbconn.get()
    for key, value in tblStudents.items():
        if value["ID"] == id:
            deletekey = key
            break
    delitem = dbconn.child(deletekey)
    delitem.delete()
    return redirect('index')

def update_section(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest' and request.method == 'POST':
        id = request.POST.get('section')
        key = request.POST.get('key')
        _, _, section_ref = connectDB()
        section_ref.child(key).update({"section": id})

        return JsonResponse({'status': 'success'})
    else:
        return JsonResponse({'status': 'errors', 'errors': 'Unable to update section.'})

def update_student(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest' and request.method == 'POST':
        id = int(request.POST.get('id'))
        fname = request.POST.get('fname')
        lname = request.POST.get('lname')
        year = int(request.POST.get('year'))
        course = request.POST.get('course')
        key = request.POST.get('key')
        attendance_ref, dbconn, _ = connectDB()
        dbconn.child(key).update({"ID": id, "FirstName": fname, "LastName": lname, "Year": year, "Course": course})

        return JsonResponse({'status': 'success'})
    else:
        return JsonResponse({'status': 'errors', 'errors': 'Unable to update student.'})

def search_students(request):
    query = request.GET.get('query', '')
    students = students.objects.filter(lname__icontains=query)
    return render(request, 'index.html', {'students': students})

def search_section(request):
    query = request.GET.get('query', '')
    sections = sections.objects.filter(section__icontains=query)
    return render(request, 'sections.html', {'sections': sections})



