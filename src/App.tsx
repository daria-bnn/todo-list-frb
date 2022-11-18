import React, { FC, useEffect, useState } from 'react'
import { query, collection, onSnapshot } from 'firebase/firestore'

import { db } from './firebase'
import TodoInput from './components/TodoIput/TodoInput'

import './App.css'
import Task from './components/Task/Task'

const App: FC = () => {
  const [todos, setTodos] = useState<any[]>([])

  useEffect(() => {
    const q = query(collection(db, 'todos'))
    const unsuscribe = onSnapshot(q, (querySnapshot) => {
      let todosArr: any[] = []
      querySnapshot.forEach((doc) => {
        todosArr.push({ ...doc.data(), id: doc.id })
      })
      setTodos(todosArr)
    })
  }, [])

  console.log(todos)

  return (
    <div className="App">
      <h1>Todo List</h1>
      <TodoInput />
      <button type="button" onClick={() => 'Submit'}>
        Отправить
      </button>
      <div>
        <p>Current tasks</p>
        <div>
          {todos.length
            ? todos.map((todo) => (
                <Task key={todo.id} data={todo.text} onChange={() => {}} />
              ))
            : 'Нет задач'}
        </div>
      </div>
    </div>
  )
}

export default App
