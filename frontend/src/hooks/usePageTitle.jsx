import { useEffect } from "react";

const usePageTitle = (title) => {
  useEffect(() => {
    document.title = `${title} | CareSync`;
  }, [title]);
};

export default usePageTitle;
