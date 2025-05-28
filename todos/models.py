from django.db import models
from django.utils import timezone # Importar timezone


class Todo(models.Model):
    title = models.CharField(max_length=200)
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True) # Modificado aqui

    def __str__(self):
        return self.title

    # Poderíamos adicionar um método save customizado para lidar com completed_at
    def save(self, *args, **kwargs):
        if self.pk is not None: # Se o objeto já existe
            original = Todo.objects.get(pk=self.pk)
            if self.completed and not original.completed: # Se está sendo marcado como completo AGORA
                self.completed_at = timezone.now()
            elif not self.completed and original.completed: # Se está sendo desmarcado como completo
                self.completed_at = None # Limpa a data de conclusão
        elif self.completed: # Se está sendo criado JÁ como completo
            self.completed_at = timezone.now()

        super().save(*args, **kwargs) # Chama o método save original
