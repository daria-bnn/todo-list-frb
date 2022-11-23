import React, { FC, useEffect, useState } from 'react'
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage'
import { v4 } from 'uuid'

import { storage } from '../../firebase'
import cnTodoForm from './TodoForm.classname'

import './TodoForm.css'
import { isTextAreaElement } from '../../types'

type TodoInputProps = {
  onCreate: (
    header: string,
    description: string,
    file: string,
    deadline: string,
    completed: boolean
  ) => void
}

const TodoForm: FC<TodoInputProps> = ({ onCreate }) => {
  const [form, setForm] = useState({
    header: '',
    description: '',
    file: '',
    deadline: '2022-12-31',
  })
  const [isLoad, setIsLoad] = useState(false)
  const [isValid, setIsValid] = useState(false)
  const [url, setUrl] = useState('')

  useEffect(() => {
    //блокировка кнопки, если не введены поля загловка и описания
    if (form.header && form.description) {
      setIsValid(true)
    } else {
      setIsValid(false)
    }
  }, [form])

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

  const handleFileDelete = () => {
    // если файл есть в storage --> удаляем его
    const desertRef = ref(storage, url)

    deleteObject(desertRef)

    setForm((prev) => ({
      ...prev,
      file: '',
    }))

    setUrl('')
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = event

    //делаем компонент контролируемым
    setForm((prev) => ({
      ...prev,
      [target.name]: target.value,
    }))

    //извлекаем файл и отправляем в storage
    const file = target.files

    //блокируем кнопку на время добавления
    if (file) {
      setIsLoad(true)

      const currentFile = file[0]
      const imageRef = ref(storage, `todos/${currentFile.name + v4()}`)

      uploadBytes(imageRef, currentFile).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          setIsLoad(false)

          setUrl(url)
        })
      })
    }
  }

  const handleSubmitTask = (event: React.FormEvent) => {
    event.preventDefault()

    const { header, description, deadline } = form

    onCreate(header, description, url, deadline, false)

    setUrl('')
    setForm((prev) => ({
      ...prev,
      header: '',
      description: '',
      file: '',
    }))
  }

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
        <p className={cnTodoForm('FileTitle')}>
          {form.file || 'Прикрепите файл'}
        </p>
        {url ? (
          <button
            className={cnTodoForm('FileButton')}
            onClick={handleFileDelete}
          >
            Удалить файл
          </button>
        ) : (
          <div className={cnTodoForm('FileWrapper')}>
            <input
              id="file"
              disabled={isLoad}
              value={form.file}
              className={cnTodoForm('FileInput')}
              type="file"
              onChange={handleFileChange}
              name="file"
            />
            <label htmlFor="file" className={cnTodoForm('FileLabel')}>
              Выберите файл
            </label>
          </div>
        )}
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
      <button
        className={cnTodoForm('Button')}
        disabled={!isValid}
        type="submit"
      >
        Добавить задачу
      </button>
    </form>
  )
}

export default TodoForm
