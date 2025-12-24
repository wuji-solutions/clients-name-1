import { ReactNode, useEffect } from "react";
import styled, { keyframes, css } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const slideDown = keyframes`
  from { transform: translateY(-100%); }
  to { transform: translateY(0); }
`;

const slideUp = keyframes`
  from { transform: translateY(0); }
  to { transform: translateY(-100%); }
`;

interface ModalProps {
  isClosing?: boolean;
}

const ModalOverlay = styled.div<ModalProps>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  z-index: 1000;

  overflow: hidden;

  height: 100dvh;
  width: 100%;

  padding-bottom: env(safe-area-inset-bottom);

  animation: ${({ isClosing }) =>
    isClosing
      ? css`${fadeOut} 0.5s ease forwards`
      : css`${fadeIn} 0.3s ease forwards`};
`;

const ModalContent = styled.div<ModalProps>`
  margin-top: 2rem;

  max-height: calc(100dvh - 2rem);
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;

  animation: ${({ isClosing }) =>
    isClosing
      ? css`${slideUp} 0.5s ease forwards`
      : css`${slideDown} 0.5s ease forwards`};
`;

function Modal({ children, isClosing }: { children: ReactNode; isClosing?: boolean }) {

  useEffect(() => {
    const scrollY = window.scrollY;

    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollY);
    };
  }, []);

  return (
    <ModalOverlay isClosing={isClosing}>
      <ModalContent isClosing={isClosing}>
        {children}
      </ModalContent>
    </ModalOverlay>
  );
}

export default Modal;
