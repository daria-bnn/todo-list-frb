import { FC, useEffect, useState } from 'react'
import { ref, deleteObject, getDownloadURL } from 'firebase/storage'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCanArrowUp } from '@fortawesome/free-solid-svg-icons/faTrashCanArrowUp'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons/faCircleCheck'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons/faPenToSquare'
import { faDownload } from '@fortawesome/free-solid-svg-icons/faDownload'
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
    const today = dayjs().format('DD.MM.YYYY')

    dayjs.extend(isSameOrBefore)

    console.log(dayjs())

    const checkDay = dayjs().isSameOrBefore(dayjs(data.deadline))

    if (checkDay) {
      setIsValidData(true)
    } else {
      setIsValidData(false)
    }
  }, [])

  console.log(isValidData)

  const handleToggle = () => {
    toggleComplete(data)
  }

  // Delete the file
  const handleDelete = () => {
    //удаление из firebase-storage
    if (data.file) {
      const desertRef = ref(storage, data.file)

      deleteObject(desertRef).then(() => {})
    }

    onDelete(data.id)
  }

  const deadline = dayjs(data.deadline).format('DD.MM.YYYY')

  const a = () => {}

  return (
    <div className={cnTask({ deadline: !isValidData })}>
      <div className={cnTask('Data')}>
        <div className={cnTask('DataDaedline', { deadline: !isValidData })}>
          {deadline}
        </div>
        <h3 className={cnTask('DataHeader')}>{data.header}</h3>
        <p className={cnTask('DataDescription')}>{data.description}</p>
        {data.file ? (
          <button className={cnTask('DataButton')} onClick={a}>
            <img src={data.file} alt="" />
            <div>Скачать файлы</div>
            {/* <a href={data.file} download="download">скачать</a>
            <FontAwesomeIcon className={cnTask('DataIcon')} icon={faDownload} /> */}
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
