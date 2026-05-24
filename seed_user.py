import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tech_support.settings')
django.setup()

from django.contrib.auth.models import User

username = 'carlosjuliani'
password = 'Carlos@Unic2026'

if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(username=username, email='', password=password)
    print("STATUS: Usuario do professor criado com sucesso.")
else:
    print("STATUS: Usuario ja existente no banco de dados.")
