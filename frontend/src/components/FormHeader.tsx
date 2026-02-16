type FormHeaderProps = {
  headerTitle: string
  headerDetails: string
  questionId?: string
}

export function FormHeader({ headerTitle, headerDetails, questionId }: FormHeaderProps) {
  return (
    <div className="flex flex-col my-8">
      <span className="font-bold text-lg">
        { questionId ? `${headerTitle} ${questionId}` : headerTitle }
      </span>
      <span className="font-normal text-lg">
        { headerDetails }
      </span>
    </div>
  )
}