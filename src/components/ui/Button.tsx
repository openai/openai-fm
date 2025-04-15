import { useAudioClip } from "@/hooks/useAudioClip";
import clsx from "clsx";
import { KeyboardEvent, MouseEvent, ReactNode } from "react";
import s from "./Button.module.css";

interface ButtonBaseProps {
  children: ReactNode;
  className?: string;
  color?: "primary" | "secondary" | "tertiary" | "neutral" | "default";
  selected?: boolean;
  disabled?: boolean;
  block?: boolean;
  ["aria-label"]?: string;
}

type ButtonProps = ButtonBaseProps &
  (
    | {
        onClick: (evt: MouseEvent) => void;
        href?: undefined;
      }
    | {
        href: string;
        target?: "_blank";
        onClick?: (evt: MouseEvent) => void;
      }
  );

export const Button = ({
  children,
  onClick,
  className = "",
  selected = false,
  disabled = false,
  block = false,
  color = "neutral",
  href,
  ...restProps
}: ButtonProps) => {
  const TagName = href ? "a" : "div";
  const playPressed = useAudioClip("/pressed.wav");

  const handleClick = (evt: MouseEvent) => {
    if (!selected) {
      playPressed();
    }
    onClick?.(evt);
  };

  const handleKeydown = (evt: KeyboardEvent) => {
    if (["Enter", " "].includes(evt.key)) {
      onClick?.(evt as unknown as MouseEvent);
    }
  };

  return (
    <TagName
      className={clsx(s.Button, className)}
      data-color={color}
      data-block={block ? "" : undefined}
      data-selected={selected ? "" : undefined}
      data-disabled={disabled ? "" : undefined}
      onKeyDown={disabled ? undefined : handleKeydown}
      onClick={disabled ? undefined : handleClick}
      href={href}
      role="button"
      tabIndex={0}
      {...restProps}
    >
      {children}
    </TagName>
  );
};

export const ButtonLED = () => {
  return <span className={s.LED} />;
};
