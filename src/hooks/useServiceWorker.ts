// hooks/useServiceWorker.ts
import { useEffect, useRef, useState } from "react";

export interface SWMessage {
  type: string;
  url: string;
  blob?: Blob;
}

export function useServiceWorker(scriptURL: string) {
  const [registration, setRegistration] =
    useState<ServiceWorkerRegistration | null>(null);
  const messageHandlers = useRef<Set<(msg: SWMessage) => void>>(new Set());

  // Register service‐worker
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    let mounted = true;
    navigator.serviceWorker
      .register(scriptURL)
      .then((reg) => {
        if (mounted) setRegistration(reg);
      })
      .catch((err) => console.error("SW registration failed", err));

    return () => {
      mounted = false;
    };
  }, [scriptURL]);

  // Global SW “message” listener
  useEffect(() => {
    function onMessage(event: MessageEvent) {
      const data = event.data as SWMessage;
      messageHandlers.current.forEach((handler) => handler(data));
    }

    navigator.serviceWorker.addEventListener("message", onMessage);
    return () => {
      navigator.serviceWorker.removeEventListener("message", onMessage);
    };
  }, []);

  // Subscribe to SW messages
  const onSWMessage = (handler: (msg: SWMessage) => void) => {
    messageHandlers.current.add(handler);
    return () => {
      messageHandlers.current.delete(handler);
    };
  };

  return { registration, onSWMessage };
}
