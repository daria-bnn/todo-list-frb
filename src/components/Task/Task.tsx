import { FC, useEffect, useState } from 'react'
import { ref, deleteObject } from 'firebase/storage'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCanArrowUp } from '@fortawesome/free-solid-svg-icons/faTrashCanArrowUp'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons/faCircleCheck'
import dayjs from 'dayjs'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'

import cnTask from './Task.classname'
import TTask from '../../types'
import { storage } from '../../firebase'

import './Task.css'

type TaskProps = {
  data: TTask
  toggleComplete: (data: TTask) => void
  onDelete: (id: string) => void
}

const Task: FC<TaskProps> = ({ data, toggleComplete, onDelete }) => {
  const [isValidData, setIsValidData] = useState(true)

  useEffect(() => {
    dayjs.extend(isSameOrBefore)

    const checkDay = dayjs().isSameOrBefore(dayjs(data.deadline))

    if (checkDay) {
      setIsValidData(true)
    } else {
      setIsValidData(false)
    }
  }, [])

  const handleToggle = () => {
    toggleComplete(data)
  }

  // Delete the file
  const handleDelete = () => {
    // удаление из firebase-storage
    if (data.file) {
      const desertRef = ref(storage, data.file)

      deleteObject(desertRef)
    }

    onDelete(data.id)
  }

  const deadline = dayjs(data.deadline).format('DD.MM.YYYY')

  return (
    <div className={cnTask({ deadline: !isValidData })}>
      <div className={cnTask('Data')}>
        <div className={cnTask('DataDaedline', { deadline: !isValidData })}>
          {deadline}
        </div>
        <h3 className={cnTask('DataHeader')}>{data.header}</h3>
        <p className={cnTask('DataDescription')}>{data.description}</p>
        {data.file ? (
          <div className={cnTask('DataWrapperImg')}>
            <div className={cnTask('DataTitleImg')}>
              Добавленное изображение
            </div>
            <img
              src={data.file}
              alt={data.header}
              className={cnTask('DataImage')}
            />
          </div>
        ) : null}
      </div>
      <div className={cnTask('Nav')}>
        <button
          type="button"
          className={cnTask('NavButton')}
          onClick={handleToggle}
        >
          <FontAwesomeIcon
            className={cnTask(
              'NavIcon',
              data.completed ? { completed: true } : null
            )}
            icon={faCircleCheck}
          />
        </button>
        <button
          type="button"
          className={cnTask('NavButton')}
          onClick={handleDelete}
        >
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
