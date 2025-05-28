# todos/admin.py
from django.contrib import admin
from .models import Todo  # Importa o modelo Todo do arquivo models.py do mesmo diretório

class TodoAdmin(admin.ModelAdmin):
    list_display = ('title', 'completed', 'created_at', 'completed_at') # Campos a serem exibidos na lista
    list_filter = ('completed', 'created_at') # Adiciona filtros na barra lateral
    search_fields = ('title',) 
# Registra o modelo Todo com a interface de admin
admin.site.register(Todo, TodoAdmin)