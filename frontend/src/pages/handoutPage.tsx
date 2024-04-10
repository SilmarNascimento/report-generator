import { Header } from "../components/header";
import { NavigationBar } from "../components/navigationBar";
import { Pagination } from "../components/pagination";

export function Handouts() {
  return (
    <>
      <Header />
      <NavigationBar />
      <h1>Handouts page</h1>
      <Pagination pages={2} items={20} page={1} totalItems={4}/>
    </>
  )
}