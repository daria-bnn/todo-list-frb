import { FC, useState } from 'react'

const TodoInput: FC = () => {
  const [value, setValue] = useState('')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = event
    setValue(target.value)
  }

  return (
    <div>
      <input name="task" value={value} onChange={handleChange} />
      <button>Добавить</button>
    </div>
  )
}

export default TodoInput
