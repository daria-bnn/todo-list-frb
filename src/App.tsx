import React, { FC, useEffect, useState } from 'react'
import {
  query,
  collection,
  onSnapshot,
  updateDoc,
  deleteDoc,
  addDoc,
  doc,
} from 'firebase/firestore'

import { db } from './firebase'
import TTask from './types'
import TodoInput from './components/TodoIput/TodoInput'
import Task from './components/Task/Task'

import './App.css'
import { stringify } from 'querystring'

const App: FC = () => {
  const [todos, setTodos] = useState<TTask[]>([])

  useEffect(() => {
    //получение данных из базы
    const q = query(collection(db, 'todos'))
    const unsuscribe = onSnapshot(q, (querySnapshot) => {
      let todosArr: TTask[] = []
      querySnapshot.forEach((doc) => {
        const text = doc.data().text
        const completed = doc.data().completed
        const url = doc.data().url

        todosArr.push({ text, completed, url, id: doc.id })
      })
      setTodos(todosArr)
    })

    return () => unsuscribe()
  }, [])

  //создание записи
  const handleCreate = async (
    value: string,
    completed: boolean,
    url?: string
  ) => {
    await addDoc(collection(db, 'todos'), {
      text: value,
      completed: false,
      url: url,
    })
  }

  //удаление записи
  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, 'todos', id))
  }

  //изменение статуса
  const handleToggle = async (todo: TTask) => {
    await updateDoc(doc(db, 'todos', todo.id), {
      completed: !todo.completed,
    })
  }

  console.log(todos)

  return (
    <div className="App">
      <h1>Todo List</h1>
      <TodoInput onCreate={handleCreate} />
      <div>
        <p>Current tasks</p>
        <div>
          {todos.length
            ? todos.map((todo) => (
                <Task
                  key={todo.id}
                  data={todo}
                  toggleComplete={handleToggle}
                  onDelete={handleDelete}
                />
              ))
            : 'Нет задач'}
        </div>
      </div>
    </div>
  )
}

export default App
