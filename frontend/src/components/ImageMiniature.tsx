import { useState } from 'react';

interface Props {
  imageUrl: string | null;
  imageBase64: string | null;
}

export default function ImageMiniature({ imageUrl, imageBase64 }: Props) {
  const [open, setOpen] = useState(false);

  const src = imageUrl || imageBase64;
  if (!src) return null;

  return (
    <>
      <div
        className="relative w-20 h-20 overflow-hidden rounded-lg border cursor-pointer group"
        onClick={() => setOpen(true)}
      >
        <img
          src={src}
          alt="miniature"
          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-110"
        />

        <div className="hidden group-hover:flex absolute inset-0 bg-black/70 items-center justify-center">
          <span className="text-white text-xs">Click to expand</span>
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setOpen(false)}
        >
          <img src={src} alt="full-size" className="max-w-full max-h-full rounded-lg shadow-xl" />
        </div>
      )}
    </>
  );
}
