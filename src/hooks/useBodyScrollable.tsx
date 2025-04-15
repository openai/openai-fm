import { useEffect, useState } from "react";

export const useBodyScrollable = () => {
  const [isScrollable, setIsScrollable] = useState(false);

  useEffect(() => {
    const checkScrollable = () => {
      const { scrollHeight, clientHeight } = document.documentElement;
      setIsScrollable(scrollHeight > clientHeight);
    };

    checkScrollable();

    window.addEventListener("resize", checkScrollable);
    const observer = new MutationObserver(checkScrollable);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      window.removeEventListener("resize", checkScrollable);
      observer.disconnect();
    };
  }, []);

  return isScrollable;
};
