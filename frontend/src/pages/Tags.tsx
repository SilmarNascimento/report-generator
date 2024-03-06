import { Header } from "../components/header";
import { NavigationBar } from "../components/navigationBar";
import { Pagination } from "../components/pagination";

export function Tags() {
  return (
    <>
      <Header />
      <NavigationBar />
      <h1>tags page</h1>
      <Pagination pages={2} items={20} page={1} />
    </>
  )
}