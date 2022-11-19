import React, { FC, useState } from 'react'
import { v4 } from 'uuid'
import { storage } from '../../firebase'
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage'

type TodoInputProps = {
  onCreate: (value: string, completed: boolean, url: string) => void
}

const TodoInput: FC<TodoInputProps> = ({ onCreate }) => {
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
    <form onSubmit={handleCreateTask}>
      <input type="text" name="task" value={value} onChange={handleChange} />
      <input type="file" onChange={handleFileChange} name="file" />
      <button type="submit">Добавить</button>
    </form>
  )
}

export default TodoInput
