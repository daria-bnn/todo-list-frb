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

import { db } from '../../firebase'
import TTask from '../../types'
import TodoForm from '../TodoForm/TodoForm'
import Task from '../Task/Task'
import cnTodoList from './TodoList.classname'

import './TodoList.css'

const TodoList: FC = () => {
  const [todos, setTodos] = useState<TTask[]>([])

  useEffect(() => {
    // получение данных из базы
    const q = query(collection(db, 'todos'))
    const unsuscribe = onSnapshot(q, (querySnapshot) => {
      const todosArr: TTask[] = []
      querySnapshot.forEach((result) => {
        const { header, description, completed, file, deadline } = result.data()

        todosArr.push({
          header,
          description,
          completed,
          file,
          deadline,
          id: result.id,
        })
      })
      setTodos(todosArr)
    })

    return () => unsuscribe()
  }, [])

  // создание записи
  const handleCreate = async (
    header: string,
    description: string,
    file: string,
    deadline: string
  ) => {
    await addDoc(collection(db, 'todos'), {
      header,
      description,
      file,
      deadline,
      completed: false,
    })
  }

  // удаление записи
  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, 'todos', id))
  }

  // изменение статуса
  const handleToggle = async (todo: TTask) => {
    await updateDoc(doc(db, 'todos', todo.id), {
      completed: !todo.completed,
    })
  }

  return (
    <div className={cnTodoList()}>
      <h1 className={cnTodoList('Title')}>Todo List</h1>
      <TodoForm onCreate={handleCreate} />
      <div>
        <p className={cnTodoList('Header')}>Текущие задачи</p>
        <div className={cnTodoList('Tasks')}>
          {todos.length ? (
            todos.map((todo) => (
              <Task
                key={todo.id}
                data={todo}
                toggleComplete={handleToggle}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <p className={cnTodoList('Info')}>Нет задач</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default TodoList
