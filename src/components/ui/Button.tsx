import { useAudioClip } from "@/hooks/useAudioClip";
import clsx from "clsx";
import { KeyboardEvent, MouseEvent, ReactNode, useRef, useEffect } from "react";
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
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const updateLighting = () => {
      const el = ref.current!;
      const rect = el.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      const maxDist = Math.hypot(window.innerWidth, window.innerHeight);
      const dist = Math.hypot(x, y);
      const norm = dist / maxDist;
      // base brightness factor (1 = full, minB = dimmest at furthest point)
      const minB = 0.6;
      const brightness = minB + (1 - norm) * (1 - minB);
      // set base brightness (distance-based) and edge opacity for this button
      el.style.setProperty("--lighting-brightness", brightness.toString());
      const baseEdge = Math.max(0, Math.min(1, 1 - norm));
      el.style.setProperty("--lighting-edge", baseEdge.toString());
    };

    updateLighting();
    window.addEventListener("resize", updateLighting);
    window.addEventListener("scroll", updateLighting, true);
    return () => {
      window.removeEventListener("resize", updateLighting);
      window.removeEventListener("scroll", updateLighting, true);
    };
  }, []);

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
    <TagName ref={ref}
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
