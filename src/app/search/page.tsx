import { Suspense } from "react";
import SearchPage from "../_components/search/searchPage";

const Page = () => {
  return <Suspense><SearchPage key={Math.random()}></SearchPage></Suspense>
};

export default Page;
