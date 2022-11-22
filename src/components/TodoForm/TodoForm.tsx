import React, { FC, useState } from 'react'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { v4 } from 'uuid'

import { storage } from '../../firebase'
import cnTodoForm from './TodoForm.classname'

import './TodoForm.css'

type TodoInputProps = {
  onCreate: (value: string, completed: boolean, url: string) => void
}

const TodoForm: FC<TodoInputProps> = ({ onCreate }) => {
  const [value, setValue] = useState('')
  const [url, setUrl] = useState('')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = event
    setValue(target.value)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files

    if (file) {
      const currentFile = file[0]
      const imageRef = ref(storage, `todos/${currentFile.name + v4()}`)

      uploadBytes(imageRef, currentFile).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          setUrl(url)
        })
      })
    }
  }

  const handleCreateTask = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    onCreate(value, false, url)
    setValue('')
    setUrl('')
  }

  return (
    <form className={cnTodoForm()} onSubmit={handleCreateTask}>
      <input
        className={cnTodoForm('Input')}
        type="text"
        name="task"
        placeholder="Введите заголовок"
        value={value}
        onChange={handleChange}
      />
      <textarea
        placeholder="Введите подробное описание"
        className={cnTodoForm('Textarea')}
      />
      <div className={cnTodoForm('File')}>
        <p className={cnTodoForm('FileTitle')}>Прикрепите файл</p>
        <label htmlFor="file" className={cnTodoForm('FileLabel')}>
          Выберите файл
          <input
            id="file"
            className={cnTodoForm('FileInput')}
            type="file"
            onChange={handleFileChange}
            name="file"
          />
        </label>
      </div>
      <div className={cnTodoForm('Date')}>
        <p className={cnTodoForm('DateTitle')}>Срок выполнения</p>
        <input
          className={cnTodoForm('DateInput')}
          id="date"
          type="date"
          name="trip-start"
          value="2022-12-31"
          min="2022-01-01"
          max="2040-12-31"
        />
      </div>
      <button className={cnTodoForm('Button')} type="submit">Добавить задачу</button>
    </form>
  )
}

export default TodoForm
