import { FC } from 'react'
import { ref, deleteObject } from 'firebase/storage'

import TTask from '../../types'
import { storage } from '../../firebase'

type TaskProps = {
  data: TTask
  toggleComplete: (data: TTask) => void
  onDelete: (id: string) => void
}

const Task: FC<TaskProps> = ({ data, toggleComplete, onDelete }) => {
  const handleToggle = () => {
    toggleComplete(data)
  }

  // Delete the file
  const handleDelete = () => {
    //удаление из firebase-storage
    if (data.url) {
      const desertRef = ref(storage, data.url)

      console.log('desertRef.name ----->   ', desertRef.name)
      deleteObject(desertRef).then(() => {
        console.log('файл также удален из хранилища')
      })
    }

    onDelete(data.id)
  }
  return (
    <div>
      <div>{data.text}</div>
      <div>
        <button onClick={handleDelete}>Удалить</button>
        {!data.completed ? (
          <button onClick={handleToggle}>Выполнить</button>
        ) : (
          <button onClick={handleToggle}>Отменить выполнение</button>
        )}
      </div>
    </div>
  )
}

export default Task
