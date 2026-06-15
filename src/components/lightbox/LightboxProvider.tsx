"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import Lightbox from "./Lightbox";

export type LightboxImage = { url: string; width?: number; height?: number };

type LightboxContextValue = {
  open: (images: LightboxImage[], index: number) => void;
  close: () => void;
  next: () => void;
  prev: () => void;
};

const LightboxContext = createContext<LightboxContextValue | null>(null);

export function useLightbox(): LightboxContextValue {
  const ctx = useContext(LightboxContext);
  if (!ctx) throw new Error("useLightbox must be used within <LightboxProvider>");
  return ctx;
}

export default function LightboxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [images, setImages] = useState<LightboxImage[]>([]);
  const [index, setIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback((imgs: LightboxImage[], i: number) => {
    setImages(imgs);
    setIndex(i);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  const next = useCallback(
    () => setIndex((i) => (images.length ? (i + 1) % images.length : 0)),
    [images.length]
  );
  const prev = useCallback(
    () =>
      setIndex((i) =>
        images.length ? (i - 1 + images.length) % images.length : 0
      ),
    [images.length]
  );

  const value = useMemo(
    () => ({ open, close, next, prev }),
    [open, close, next, prev]
  );

  return (
    <LightboxContext.Provider value={value}>
      {children}
      <Lightbox
        images={images}
        index={index}
        isOpen={isOpen}
        onClose={close}
        onNext={next}
        onPrev={prev}
      />
    </LightboxContext.Provider>
  );
}
