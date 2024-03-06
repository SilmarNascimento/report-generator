import { Header } from "../components/header";
import { NavigationBar } from "../components/navigationBar";
import { Pagination } from "../components/pagination";

export function MainQuestions() {
  return (
    <>
      <Header />
      <NavigationBar />
      <h1>Main Questions page</h1>
      <Pagination pages={2} items={20} page={1} />
    </>
  )
}