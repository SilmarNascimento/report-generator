import { NavigationBar } from "../components/NavigationBar";
import { Pagination } from "../components/Pagination";
import PaginaContainer from "@/components/Shared/PaginaContainer";

export function Handouts() {
  return (
    <>
      <NavigationBar />
      <PaginaContainer>
        <h1>Handouts page</h1>
        <Pagination pages={2} items={20} page={1} totalItems={4} />
      </PaginaContainer>
    </>
  );
}
