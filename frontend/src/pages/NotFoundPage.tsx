import { Link } from "react-router-dom"

export function NotFoundPage() {
  return (
    <>
      <h1>Página não encontrada</h1>
      <Link to={"/mock-exams"}>Mock exams</Link>
    </>
  )
}