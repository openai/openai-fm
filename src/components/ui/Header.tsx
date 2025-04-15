import { useAudioClip } from "@/hooks/useAudioClip";
import { Switcher } from "./Switcher";
import clsx from "clsx";
import { External } from "./Icons";

interface HeaderProps {
  devMode: boolean;
  setDevMode: (devMode: boolean) => void;
}

export const Header = ({ devMode, setDevMode }: HeaderProps) => {
  const playToggle = useAudioClip("/click.wav");

  return (
    <header className="flex w-full max-w-(--page-max-width) mx-auto mb-12 md:mb-8">
      <div className="grid grid-cols-12 gap-x-3">
        <div className="col-span-2 order-1 mb-8 md:mb-0">
          <div
            className={clsx(
              "relative top-[0.0875rem]",
              devMode && "cursor-pointer"
            )}
            onClick={() => {
              if (!devMode) {
                return;
              }

              playToggle();
              setDevMode(false);
            }}
          >
            <Logo />
          </div>
        </div>
        <div className="col-span-12 md:col-span-7 xl:col-span-6 order-3 md:order-2">
          <div className="text-balance">
            <div className="text-current/70 mb-3">
              An interactive demo for developers to try the new text-to-speech
              model in the OpenAI API.{" "}
            </div>
            <a
              className="uppercase hover:text-current/70 transition-colors inline-block"
              href="https://platform.openai.com/docs/guides/audio"
              target="_blank"
            >
              <span className="flex items-center gap-x-1">
                Start building
                <External className="h-[.93rem] w-[.93rem]" />
              </span>
            </a>
          </div>
        </div>
        <div className="col-span-10 md:col-span-3 xl:col-span-4 flex justify-end items-start order-2 md:order-3">
          <div className="relative -top-[0.57rem]">
            <Switcher
              checked={devMode}
              onChange={(checked) => setDevMode(checked)}
              id="dev-mode"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

const Logo = () => {
  return (
    <svg
      width="91"
      height="18"
      viewBox="0 0 91 18"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M75.6426 13.5056V4.13491H78.4612V5.23624C78.9279 4.45224 79.8799 3.94824 81.0559 3.94824C82.2879 3.94824 83.3146 4.47091 83.9119 5.51624C84.5466 4.54557 85.6666 3.94824 86.9359 3.94824C89.0826 3.94824 90.4826 5.32958 90.4826 7.58824V13.5056H87.6639V8.05491C87.6639 6.93491 87.1226 6.33757 86.2826 6.33757H86.2452C85.1999 6.33757 84.4719 7.28957 84.4719 8.50291V13.5056H81.6532V8.05491C81.6532 6.93491 81.1119 6.33757 80.2719 6.33757H80.2346C79.1892 6.33757 78.4612 7.28957 78.4612 8.50291V13.5056H75.6426Z" />
      <path d="M69.657 13.5061V6.30079H67.7344V4.13545H69.657V3.59412C69.657 1.57812 70.5717 0.439453 72.7557 0.439453H75.1264V2.64212H73.577C72.6624 2.64212 72.4197 2.88479 72.4197 3.79945V4.13545H74.641V6.30079H72.4197V13.5061H69.657Z" />
      <path d="M66.1772 13.6921C65.2625 13.6921 64.4785 12.9268 64.4785 11.9935C64.4785 11.0601 65.2625 10.3135 66.1772 10.3135C67.1105 10.3135 67.8758 11.0601 67.8758 11.9935C67.8758 12.9268 67.1105 13.6921 66.1772 13.6921Z" />
      <path d="M60.0059 13.5061V0.439453H62.9179V13.5061H60.0059Z" />
      <path d="M45.4473 13.5061L50.6553 0.439453H54.0526L59.1113 13.5061H56.0313L55.0046 10.7435H49.5166L48.4713 13.5061H45.4473ZM50.4313 8.29812H54.0899L52.2793 3.44479L50.4313 8.29812Z" />
      <path d="M36.084 13.5056V4.13491H38.9026V5.23624C39.3693 4.45224 40.3586 3.94824 41.5346 3.94824C43.532 3.94824 44.932 5.32958 44.932 7.58824V13.5056H42.1133V8.05491C42.1133 6.93491 41.572 6.33757 40.732 6.33757H40.6946C39.6493 6.33757 38.9026 7.28957 38.9026 8.50291V13.5056H36.084Z" />
      <path d="M30.1137 13.7296C27.4817 13.7296 25.4844 11.7322 25.4844 8.87624C25.4844 6.02024 27.5004 3.94824 30.1137 3.94824C32.279 3.94824 34.3884 5.25491 34.7804 7.88691C34.855 8.42824 34.8737 9.02557 34.799 9.66024H28.191C28.2657 10.7429 29.0497 11.5456 30.0577 11.5456H30.1697C31.1217 11.5456 31.6444 10.9669 31.8684 10.5002H34.6124C34.1457 12.0869 32.671 13.7296 30.1137 13.7296ZM31.999 7.70024C31.9057 6.86024 31.1777 6.13224 30.1884 6.13224H30.0764C29.087 6.13224 28.359 6.86024 28.2284 7.70024H31.999Z" />
      <path d="M14.8105 17.2389V4.13491H17.6292V5.25491C18.0399 4.54557 18.9919 3.94824 20.3172 3.94824C22.6319 3.94824 24.6292 5.81491 24.6292 8.82024C24.6292 11.8256 22.5759 13.7296 20.2612 13.7296C19.0105 13.7296 18.1145 13.2442 17.6292 12.5909V17.2389H14.8105ZM19.7572 11.3402C20.9705 11.3402 21.8479 10.3509 21.8479 8.83891C21.8479 7.32691 20.9705 6.33757 19.7572 6.33757H19.7199C18.5065 6.33757 17.6292 7.32691 17.6292 8.83891C17.6292 10.3509 18.5065 11.3402 19.7199 11.3402H19.7572Z" />
      <path d="M7.00989 13.6929C3.40723 13.6929 0.476562 10.6876 0.476562 6.97293C0.476562 3.25826 3.40723 0.25293 7.00989 0.25293C10.6126 0.25293 13.5432 3.25826 13.5432 6.97293C13.5432 10.6876 10.6126 13.6929 7.00989 13.6929ZM7.14056 10.9676C8.98856 10.9676 10.5192 9.43693 10.5192 6.97293C10.5192 4.50893 8.98856 2.97826 7.14056 2.97826H6.91656C5.04989 2.97826 3.50056 4.50893 3.50056 6.97293C3.50056 9.43693 5.04989 10.9676 6.91656 10.9676H7.14056Z" />
    </svg>
  );
};
