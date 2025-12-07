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
      {images.length > 1 && (
        <div
          style={{
            display: 'flex',
            gap: '32px',
            alignItems: 'center',
          }}
        >
          <button
            onClick={prev}
            aria-label="Previous"
            style={{
              fontSize: '70px',
              lineHeight: '1',
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              padding: '8px',
            }}
          >
            &#8592;
          </button>
          <button
            onClick={next}
            aria-label="Next"
            style={{
              fontSize: '70px',
              lineHeight: '1',
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              padding: '8px',
            }}
          >
            &#8594;
          </button>
        </div>
      )}
    </div>
  );
}
