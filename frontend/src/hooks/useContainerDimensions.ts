import { useState, useLayoutEffect, useRef } from 'react';

export const useContainerDimensions = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (ref.current) {
      const measure = () => {
        setDimensions({
          width: ref.current ? ref.current.offsetWidth : 0,
          height: ref.current ? ref.current.offsetHeight : 0,
        });
      };

      // Initial measurement
      measure();

      const resizeObserver = new ResizeObserver(measure);
      resizeObserver.observe(ref.current);

      return () => resizeObserver.disconnect();
    }
  }, []);

  return { ref, dimensions };
};