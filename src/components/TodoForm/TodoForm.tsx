import React, { FC, useState } from 'react'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { v4 } from 'uuid'

import { storage } from '../../firebase'
import cnTodoForm from './TodoForm.classname'

import './TodoForm.css'

type TodoInputProps = {
  onCreate: (
    header: string,
    description: string,
    file: string,
    deadline: string,
    completed: boolean
  ) => void
}

// type-garden
function isTextAreaElement(
  element: HTMLInputElement | HTMLTextAreaElement
): element is HTMLTextAreaElement {
  return element.tagName === 'TEXTAREA'
}

const TodoForm: FC<TodoInputProps> = ({ onCreate }) => {
  const [form, setForm] = useState({
    header: '',
    description: '',
    file: '',
    deadline: '2022-12-31',
  })
  const [value, setValue] = useState('')
  const [url, setUrl] = useState('')

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { target } = event
    if (isTextAreaElement(target)) {
      setForm((prev) => ({ ...prev, [target.name]: target.value }))

      return
    }
    setForm((prev) => ({
      ...prev,
      [target.name]: target.value,
    }))
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

  const handleSubmitTask = (event: React.FormEvent) => {
    event.preventDefault()

    const { header, description, file, deadline } = form

    onCreate(header, description, file, deadline, false)
    //!! очистить поля ввода
  }

  console.log(form)

  return (
    <form className={cnTodoForm()} onSubmit={handleSubmitTask}>
      <input
        className={cnTodoForm('Input')}
        type="text"
        name="header"
        placeholder="Введите заголовок"
        value={form.header}
        onChange={handleInputChange}
      />
      <textarea
        name="description"
        value={form.description}
        onChange={handleInputChange}
        placeholder="Введите подробное описание"
        className={cnTodoForm('Textarea')}
      />
      <div className={cnTodoForm('File')}>
        <p className={cnTodoForm('FileTitle')}>Прикрепите файл</p>
        <label htmlFor="file" className={cnTodoForm('FileLabel')}>
          Выберите файл
          <input
            id="file"
            value={form.file}
            className={cnTodoForm('FileInput')}
            type="file"
            onChange={handleInputChange}
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
          name="deadline"
          value={form.deadline}
          onChange={handleInputChange}
          min="2022-01-01"
          max="2040-12-31"
        />
      </div>
      <button className={cnTodoForm('Button')} type="submit">
        Добавить задачу
      </button>
    </form>
  )
}

export default TodoForm
