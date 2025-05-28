# todos/serializers.py

from rest_framework import serializers
from .models import Todo

class TodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo  # O modelo que este serializer irá usar
        fields = ['id', 'title', 'completed', 'created_at', 'completed_at']
        # 'fields' especifica quais campos do modelo Todo devem ser incluídos na representação JSON.
        # '__all__' também poderia ser usado para incluir todos os campos automaticamente.
        # 'id' é a chave primária, que é criada automaticamente pelo Django para cada modelo.