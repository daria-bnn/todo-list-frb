import { FC } from 'react'
import TTask from '../../types'
import { getStorage, ref, deleteObject } from 'firebase/storage'
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

  const handleDelete = () => {
    // Delete the file
    const desertRef = ref(storage, data.url)

    console.log('desertRef.name ----->   ', desertRef.name)
    deleteObject(desertRef).then(() => {
      console.log('файл также удален из хранилища')
    })
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
