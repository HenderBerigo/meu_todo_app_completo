// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import TodoForm from './TodoForm'; // 1. Importe o TodoForm

function App() {
  const [todos, setTodos] = useState([]);
  const [editingTodoId, setEditingTodoId] = useState(null); // ID da tarefa sendo editada, ou null
  const [currentEditText, setCurrentEditText] = useState('');

  // Função para buscar todos
  const fetchTodos = async () => { // Movida para fora do useEffect para ser reutilizável
    try {
      const response = await fetch('http://127.0.0.1:8000/api/todos/');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error("Falha ao buscar tarefas:", error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []); // Executa fetchTodos apenas uma vez ao montar

  // 2. Função para adicionar uma nova tarefa
  const handleAddTodo = async (newTodoData) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/todos/', {
        method: 'POST', // Especifica o método HTTP
        headers: {
          'Content-Type': 'application/json', // Informa ao servidor que estamos enviando JSON
        },
        body: JSON.stringify(newTodoData), // Converte o objeto JavaScript para uma string JSON
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const addedTodo = await response.json(); // Pega a tarefa recém-adicionada da resposta
      setTodos(prevTodos => [addedTodo, ...prevTodos]); // Adiciona a nova tarefa no início da lista (melhor UX)
      // OU, mais simples por enquanto, apenas re-busque todas as tarefas:
      fetchTodos(); // Re-busca todas as tarefas para atualizar a lista
    } catch (error) {
      console.error("Falha ao adicionar tarefa:", error);
    }
  };

  const handleToggleComplete = async (todoId) => { // Não precisa mais de currentCompletedStatus
    // Primeiro, encontramos a tarefa no estado atual para saber o status que queremos enviar
    const taskToToggle = todos.find(todo => todo.id === todoId);
    if (!taskToToggle) return; // Tarefa não encontrada

    const newCompletedStatus = !taskToToggle.completed;

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/todos/${todoId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: newCompletedStatus }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedTodoFromServer = await response.json(); // Pega a tarefa atualizada da API

      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === todoId ? updatedTodoFromServer : todo // Substitui com os dados da API
        )
      );
    } catch (error) {
      console.error("Falha ao atualizar tarefa:", error);
    }
  };

  const handleDeleteTodo = async (todoId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/todos/${todoId}/`, {
        method: 'DELETE', // Especifica o método HTTP DELETE
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Atualiza o estado local para remover a tarefa da lista
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
    } catch (error) {
      console.error("Falha ao excluir tarefa:", error);
    }
  };

  const handleStartEdit = (todo) => {
    setEditingTodoId(todo.id);
    setCurrentEditText(todo.title); // Preenche o input com o título atual da tarefa
  };

  const handleCancelEdit = () => {
    setEditingTodoId(null);
    setCurrentEditText('');
  };

  const handleSaveEdit = async () => {
    if (!currentEditText.trim()) {
      alert('O título da tarefa não pode ficar vazio.'); // Validação simples
      // Poderia também apenas cancelar a edição ou focar no input novamente
      setCurrentEditText(todos.find(todo => todo.id === editingTodoId)?.title || ''); // Restaura o título original se vazio
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/todos/${editingTodoId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: currentEditText.trim() }), // Envia apenas o título atualizado
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedTodoFromServer = await response.json(); // Pega a tarefa atualizada da API

      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === editingTodoId ? updatedTodoFromServer : todo // Substitui com os dados da API
        )
      );

      handleCancelEdit(); // Sai do modo de edição (limpa editingTodoId e currentEditText)

    } catch (error) {
      console.error("Falha ao salvar a edição da tarefa:", error);
      alert("Não foi possível salvar as alterações. Tente novamente.");
      // Opcional: poderia não sair do modo de edição aqui para o usuário tentar novamente
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Minha Lista de Tarefas (React)</h1>
      </header>
      <main>
        <TodoForm onSubmit={handleAddTodo} />

        {/* <h2>Tarefas:</h2> */}
        {todos.length === 0 ? (
          <p className="no-todos-message">Nenhuma tarefa encontrada. Adicione algumas!</p>
        ) : (
          <ul className="todo-list">
            {todos.map(todo => (
              <li key={todo.id} className={`todo-item ${todo.completed ? 'todo-item-completed' : ''} ${editingTodoId === todo.id ? 'editing' : ''}`}>
                {editingTodoId === todo.id ? (
                  <>
                  <input
                      type="text"
                      value={currentEditText}
                      onChange={(e) => setCurrentEditText(e.target.value)}
                      className="edit-input"
                      autoFocus /* Foca automaticamente no input ao aparecer */
                    />
                    <div className="edit-actions">
                      <button onClick={handleSaveEdit} className="save-button">Salvar</button> {/* MUDANÇA AQUI */}
                      <button onClick={handleCancelEdit} className="cancel-button">Cancelar</button>
                    </div>
                  </>
                ) : (
                <>
                <label htmlFor={`todo-checkbox-${todo.id}`} className="todo-label">
                <input
                  type="checkbox"
                  id={`todo-checkbox-${todo.id}`}
                  checked={todo.completed}
                  onChange={() => handleToggleComplete(todo.id)}
                />
                <span className="todo-title">
                    {todo.title}
                  </span>
                </label>
                {todo.completed && todo.completed_at && (
                  <span className="completion-date">
                    Concluída em: {formatDate(todo.completed_at)}
                  </span>
                )}

                <div className="item-actions">
                <button onClick={() => handleStartEdit(todo)} className="edit-button">Editar</button>
                <button onClick={() => handleDeleteTodo(todo.id)} className="delete-button">Excluir</button>
                </div>
                </>
                )}
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}

export default App;