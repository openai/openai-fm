import * as React from "react";
import { Switch } from "radix-ui";
import s from "./Switcher.module.css";
import { useAudioClip } from "@/hooks/useAudioClip";
import { Code } from "./Icons";
interface SwitcherProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  id: string;
}

export const Switcher = ({ checked, onChange, id }: SwitcherProps) => {
  const play = useAudioClip("/click.wav");

  return (
    <div className="flex items-center cursor-pointer hover:text-current/70 transition-colors">
      <label
        className="pr-3 leading-none uppercase cursor-pointer"
        htmlFor={id}
      >
        <Code className="w-[2.29rem] h-[2.29rem]" />
      </label>
      <Switch.Root
        id={id}
        className={s.Track}
        checked={checked}
        onCheckedChange={(nextChecked) => {
          play();
          onChange(nextChecked);
        }}
      >
        <Switch.Thumb className={s.Thumb} />
      </Switch.Root>
    </div>
  );
};
