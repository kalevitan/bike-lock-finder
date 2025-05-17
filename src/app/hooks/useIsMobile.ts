import { useEffect, useState } from "react";

enum TailwindBreakpoint {
  SM = 'sm',
  MD = 'md',
  LG = 'lg',
  XL = 'xl',
  XXL = '2xl',
}
export const useTailwindBreakpoint = (): TailwindBreakpoint => {
  const tailwindBreakpointFromWidth = (width: number): TailwindBreakpoint => {
    if (width < 768) {
      return TailwindBreakpoint.SM;
    }
    if (width < 1024) {
      return TailwindBreakpoint.MD;
    }
    if (width < 1280) {
      return TailwindBreakpoint.LG;
    }
    if (width < 1536) {
      return TailwindBreakpoint.XL;
    }
    return TailwindBreakpoint.XXL;
  };

  const [tailwindBreakpoint, setTailwindBreakpoint] = useState<TailwindBreakpoint>(TailwindBreakpoint.MD);
  useEffect(() => {
    const handleResize = () => {
      setTimeout(() => {
        setTailwindBreakpoint(tailwindBreakpointFromWidth(window.innerWidth));
      }, 50);
    };
    handleResize();

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return tailwindBreakpoint;
};

export const useIsMobile = () => {
  const twBreakpoint = useTailwindBreakpoint();
  return twBreakpoint === TailwindBreakpoint.SM;
};