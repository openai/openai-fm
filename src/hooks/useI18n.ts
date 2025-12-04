import { useCallback } from "react";
import { appStore } from "@/lib/store";
import { MessageKey, translate } from "@/lib/i18n";

export const useI18n = () => {
  const language = appStore.useState((state) => state.language);

  const t = useCallback(
    (key: MessageKey) => translate(key, language),
    [language]
  );

  return { t, language };
};
