import { FC } from 'react'
import { ref, deleteObject } from 'firebase/storage'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCanArrowUp } from '@fortawesome/free-solid-svg-icons/faTrashCanArrowUp'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons/faCircleCheck'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons/faPenToSquare'
import { faDownload } from '@fortawesome/free-solid-svg-icons/faDownload'

import cnTask from './Task.classname'
import TTask from '../../types'
import { storage } from '../../firebase'

import './Task.css'

const icon = 'fa-regular fa-circle-trash'

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
    if (data.file) {
      const desertRef = ref(storage, data.file)

      console.log('desertRef.name ----->   ', desertRef.name)
      deleteObject(desertRef).then(() => {
        console.log('файл также удален из хранилища')
      })
    }

    onDelete(data.id)
  }
  return (
    <div className={cnTask()}>
      <div className={cnTask('Data')}>
        <div className={cnTask('DataDaedline')}>{data.deadline}</div>
        <h3 className={cnTask('DataHeader')}>{data.header}</h3>
        <p className={cnTask('DataDescription')}>{data.description}</p>
        {data.file ? (
          <button className={cnTask('DataButton')}>
            <div>Скачать файлы</div>
            <FontAwesomeIcon className={cnTask('DataIcon')} icon={faDownload} />
          </button>
        ) : null}
      </div>
      <div className={cnTask('Nav')}>
        <button className={cnTask('NavButton')} onClick={handleToggle}>
          <FontAwesomeIcon
            className={cnTask(
              'NavIcon',
              data.completed ? { completed: true } : null
            )}
            icon={faCircleCheck}
          />
        </button>

        <button className={cnTask('NavButton')}>
          <FontAwesomeIcon icon={faPenToSquare} className={cnTask('NavIcon')} />
        </button>
        <button className={cnTask('NavButton')} onClick={handleDelete}>
          <FontAwesomeIcon
            icon={faTrashCanArrowUp}
            className={cnTask('NavIcon')}
          />
        </button>
      </div>
    </div>
  )
}

export default Task
