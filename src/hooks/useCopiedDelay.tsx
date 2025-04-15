import { useEffect, useRef, useState } from "react";

export const useCopiedDelay = () => {
  const [copied, setCopied] = useState<boolean>(false);
  const copiedTimeout = useRef<NodeJS.Timeout | null>(null);

  const trigger = () => {
    setCopied(true);

    copiedTimeout.current = setTimeout(() => {
      setCopied(false);
    }, 1600);
  };

  useEffect(() => {
    return () => {
      if (copiedTimeout.current) clearTimeout(copiedTimeout.current);
    };
  }, []);

  return { copied, trigger };
};
