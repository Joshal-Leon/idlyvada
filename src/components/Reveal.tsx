import { PropsWithChildren, CSSProperties } from "react";
import { useReveal } from "@/hooks/useReveal";

interface RevealProps {
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article";
}

export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: PropsWithChildren<RevealProps>) {
  const { ref, shown } = useReveal<HTMLDivElement>();
  const style: CSSProperties = {
    transitionDelay: `${delay}ms`,
  };
  return (
    <Tag
      ref={ref as never}
      style={style}
      className={`transition-all duration-[900ms] ease-out will-change-transform ${
        shown ? "opacity-100 translate-y-0 blur-0" : "opacity-0 translate-y-8 blur-[6px]"
      } ${className}`}
    >
      {children}
    </Tag>
  );
}
