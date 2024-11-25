import React, {useState, useEffect} from 'react';
import axios from 'axios';

const API_url = 'http://localhost:8000/todo';

export default function TodoList() {

    const [todos, setTodos] = useState([]);
    const [newTitles, setNewTitles] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [error, setError] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('')
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 3;
    
useEffect(() => {
    fetchTodos(currentPage)
}, [currentPage]);

 const fetchTodos = async (page) => {
    try {
        const response = await axios.get(`${API_url}?page=${page}&limit=${limit}`, {withCredentials: true});
        setTodos(response.data.getTodo)
        setTotalPages(response.data.totalPages)
    } catch (error) {
        setError("Error in fetching todos")
    }
 }

const addTodos = async () => {
    try {
        const response = await axios.post(API_url, {title: newTitles, description : newDescription}, {withCredentials: true});
        setTodos([...todos, response.data]);
        setNewTitles('');
        setNewDescription('')
    } catch (error) {
        setError('Error in Adding todos')
    }
}

const deleteTodos = async (id) =>{
    try {
        await axios.delete(`${API_url}/${id}`, {withCredentials : true})
        setTodos(todos.filter (todo => todo._id !== id))
    } catch (error) {
        setError('Error in deleting todos')
    }
}

const updateTodo = async (id, status) => {
    try {
         axios.put(`${API_url}/${id}`,
             {status : !status} ,
              {withCredentials: true})
              setTodos(todos.map (todo => (
                todo._id === id ? {...todo, status : !status} : todo
              )))
    } catch (error) {
        setError('Cant update todo')
    }
}

const startEditing = (id, title, description) => {
    setEditingId(id);
    setEditTitle(title);
    setEditDescription(description);
}

const editTodo = async (id, ) => {
    try {
        const response = await axios.put(`${API_url}/${id}`, 
            {title : editTitle, description : editDescription},
        {withCredentials : true}
        );
        setTodos(todos.map (todo => (todo._id === id ? response.data : todo)))
        setEditingId(null)
        setEditTitle('');
        setEditDescription('');
    } catch (error) {
        setError('Error in editing todo')
    }
}

const prevBtn = () => {
    if(currentPage > 1) setCurrentPage(currentPage - 1)
}

const nextBtn = () => {
    if(currentPage < totalPages) setCurrentPage(currentPage + 1)
}

  return (
    <div>
        <h1>TodoList</h1>
        <input
        type='text'
        value={newTitles}
        onChange={(e) => setNewTitles(e.target.value)}
        placeholder='Add Title'
        />
        <input
        type='text'
        value={newDescription}
        onChange={(e) => setNewDescription(e.target.value)}
        placeholder='Add Description'
        />
        <button onClick={addTodos}>Add todo</button>
        {error && <p style={{color:'red'}}>{error}</p>}

        <ol>
        {todos.map(todo => (
    <li key={todo._id} style={{textDecoration: todo.status ? 'line-through' : 'none'}}>
       {editingId === todo._id ? (
        <>
        <input
      type='text'
      value={editTitle}
      onChange={(e) => setEditTitle(e.target.value)}
      placeholder='Add Title to Edit' 
      />
      <input
      type='text'
      value={editDescription}
      onChange={(e) => setEditDescription(e.target.value)}
      placeholder='Add Description to Edit' 
      />
      <button onClick={() => editTodo(todo._id)}>Save</button>
      <button onClick={() => setEditingId(null)}>Cancel</button>
        </>
       ) : (
        <>
         <span>Title : </span>{todo.title}
    <br/>
    <span>Description : </span>{todo.description}
    <br/>
    <button onClick={() => deleteTodos(todo._id)}>Delete</button>
    <button onClick={() => updateTodo(todo._id, todo.status)}>{todo.status ? 'undo' : 'completed' }</button>
    <button onClick={() => startEditing(todo._id, todo.title, todo.description)}>Edit</button>
    <hr/>
        </>
       )}
    </li>
))}
        </ol>
        <div>
        <button onClick={prevBtn} disabled={currentPage === 1}>Prev</button>
        <span>{currentPage} of {totalPages}</span>
        <button onClick={nextBtn} disabled={currentPage === totalPages}>Prev</button>
        </div>
    </div>
  )
}
