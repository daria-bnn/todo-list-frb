import React, { FC, useEffect, useState } from 'react'
import dayjs from 'dayjs'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
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
    //получение даты

    const data = dayjs().format()

    //получение данных из базы
    const q = query(collection(db, 'todos'))
    const unsuscribe = onSnapshot(q, (querySnapshot) => {
      let todosArr: TTask[] = []
      querySnapshot.forEach((doc) => {
        const { header, description, completed, file, deadline } = doc.data()

        todosArr.push({
          header,
          description,
          completed,
          file,
          deadline,
          id: doc.id,
        })
      })
      setTodos(todosArr)
    })

    return () => unsuscribe()
  }, [])

  useEffect(() => {
    //проверка времени
    console.log('обновление todos')
  }, [todos])

  //создание записи
  const handleCreate = async (
    header: string,
    description: string,
    file: string,
    deadline: string,
    completed: boolean
  ) => {
    await addDoc(collection(db, 'todos'), {
      header,
      description,
      file,
      deadline,
      completed: false,
    }).then(() => console.log('GREAT'))
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

  return (
    <div className={cnTodoList()}>
      <h1 className={cnTodoList('Title')}>Todo List</h1>
      <TodoForm onCreate={handleCreate} />
      <div>
        <p>Current tasks</p>
        <div className={cnTodoList('Tasks')}>
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

export default TodoList
