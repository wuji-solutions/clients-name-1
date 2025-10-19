import { useState, ReactNode } from "react";
import styled, { keyframes, css } from "styled-components";

// Animations
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

// Props interface
interface ModalProps {
  isClosing?: boolean;
}

// Styled components
const ModalOverlay = styled.div<ModalProps>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  overflow-y: scroll;
  z-index: 999;

  animation: ${({ isClosing }) =>
    isClosing
      ? css`${fadeOut} 0.5s ease forwards`
      : css`${fadeIn} 1s ease forwards`};
`;

const ModalContent = styled.div<ModalProps>`
  margin-top: 2rem;
  animation: ${({ isClosing }) =>
    isClosing
      ? css`${slideUp} 0.5s ease forwards`
      : css`${slideDown} 1.5s ease forwards`};
`

function Modal({ children, isClosing }: { children: ReactNode, isClosing?: boolean }) {
  return (
    <ModalOverlay>
      <ModalContent isClosing={isClosing}>{children}</ModalContent>
    </ModalOverlay>
  );
}

export default Modal;
