import { useState } from 'react';
import styled from 'styled-components';
import { TaskImage } from '../common/types';
import { taskImageToSrc } from '../common/utils';

interface Props {
  readonly imageUrl: string | null;
  readonly imageBase64: string | null;
}

const MiniatureWrapper = styled.div`
  position: relative;
  width: 80px;
  height: auto; /* allow height to adapt */
  overflow: hidden;
  cursor: pointer;
  display: inline-block; /* keep wrapper tight around image */
`;

const MiniatureImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.2s ease;

  ${MiniatureWrapper}:hover & {
    transform: scale(1.1);
  }
`;

const HoverOverlay = styled.div`
  display: none;
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  align-items: center;
  justify-content: center;

  ${MiniatureWrapper}:hover & {
    display: flex;
  }
`;

const FullscreenOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 16px;
`;

const FullImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  min-height: 250px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
`;

export default function ImageMiniature(image: TaskImage) {
  const [open, setOpen] = useState(false);

  const src = taskImageToSrc(image);

  return (
    <>
      <MiniatureWrapper onClick={() => setOpen(true)}>
        <MiniatureImage src={src} alt="zdjecie" />
        <HoverOverlay>
          <span style={{ color: 'white', fontSize: '12px' }}>Przybliż</span>
        </HoverOverlay>
      </MiniatureWrapper>

      {open && (
        <FullscreenOverlay onClick={() => setOpen(false)}>
          <FullImage src={src} alt="zdjecie" />
        </FullscreenOverlay>
      )}
    </>
  );
}
