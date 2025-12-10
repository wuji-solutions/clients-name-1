export function calculateZoom(windowHeight: number): number {
  const minHeight = 720;    // minimum to scale
  const refHeight = 900;    // when scale hits 100%
  const minZoom = 0.80;    
  const maxZoom = 1.00;    

  if (windowHeight >= refHeight) return maxZoom;
  if (windowHeight <= minHeight) return minZoom;

  const t = (windowHeight - minHeight) / (refHeight - minHeight);

  return minZoom + t * (maxZoom - minZoom);
}
