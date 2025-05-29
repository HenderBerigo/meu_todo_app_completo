// frontend/src/TodoForm.js
import React, { useState } from 'react';

function TodoForm({ onSubmit }) {
  const [title, setTitle] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    if (!title.trim()) return; 

    await onSubmit({ title: title, completed: false });
    setTitle('');
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <input
        type="text"
        placeholder="Adicionar nova tarefa..."
        value={title}
        onChange={(e) => setTitle(e.target.value)} // Atualiza o estado 'title' a cada digitação
      />
      <button type="submit">Adicionar</button>
    </form>
  );
}

export default TodoForm;