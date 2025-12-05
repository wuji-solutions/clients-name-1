import { useState } from 'react';

interface ImageWrapperProps {
  images: any[];
}

export default function ImageWrapper({ images }: ImageWrapperProps) {
  const [index, setIndex] = useState(0);

  const prev = () => {
    setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  };

  const next = () => {
    setIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  };

  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      <div style={{ display: 'inline-block' }}>{images[index]}</div>

      <div style={{ display: 'flex', gap: '16px' }}>
        <button onClick={prev} aria-label="Previous">
          {'<-'}
        </button>
        <button onClick={next} aria-label="Next">
          {'->'}
        </button>
      </div>
    </div>
  );
}
