import { FC } from 'react'

type TaskProps = {
  data: string
  onChange: () => void
}

const Task: FC<TaskProps> = ({ data, onChange }) => {
  return (
    <div>
      <div>{data}</div>
      <div>
        <button>Удалить</button>
        <button>Выполнить</button>
      </div>
    </div>
  )
}

export default Task
