type TTask = {
  id: string
  header: string
  description: string
  completed: boolean
  deadline: string
  file?: string
}

// type-garden
export function isTextAreaElement(
  element: HTMLInputElement | HTMLTextAreaElement
): element is HTMLTextAreaElement {
  return element.tagName === 'TEXTAREA'
}

export default TTask
