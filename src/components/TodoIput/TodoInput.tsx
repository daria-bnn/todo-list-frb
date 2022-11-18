import { FC, useState } from 'react'

type TodoInputProps = {
  onCreate: (value: string, completed: boolean) => void
}

const TodoInput: FC<TodoInputProps> = ({ onCreate }) => {
  const [value, setValue] = useState('')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = event
    setValue(target.value)
  }

  const handleCreateTask = () => {
    onCreate(value, false)
    setValue('')
  }

  return (
    <div>
      <input name="task" value={value} onChange={handleChange} />
      <button onClick={handleCreateTask}>Добавить</button>
    </div>
  )
}

export default TodoInput
