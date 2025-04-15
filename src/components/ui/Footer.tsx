import React, { ReactNode } from "react";
import { Docs } from "./Icons";
import { Button } from "./Button";
import s from "./Footer.module.css";
import { CodeCopyButton } from "../CodeCopyButton";
import PlayButton from "../PlayButton";
import DownloadButton from "../DownloadButton";
import { ShareButton } from "../ShareButton";

export const FooterWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <footer className={`${s.Footer} py-3 px-6`}>
      <div className="relative w-full max-w-(--page-max-width) m-auto">
        {children}
      </div>
    </footer>
  );
};

export const Footer = ({ devMode }: { devMode: boolean }) => {
  return (
    <FooterWrapper>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {devMode ? <DocsLink /> : <DownloadButton />}
        {devMode ? <CodeCopyButton /> : <ShareButton />}
        <div className="flex col-span-1 sm:col-span-2">
          <PlayButton />
        </div>
      </div>
    </FooterWrapper>
  );
};

const DocsLink = () => {
  return (
    <Button
      color="tertiary"
      href="https://platform.openai.com/docs/guides/text-to-speech"
    >
      <Docs />

      <span className="uppercase hidden md:inline pr-3">Docs</span>
    </Button>
  );
};
