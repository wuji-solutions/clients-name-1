import { keyframes, styled } from 'styled-components';
import { ReactNode } from 'react';

const fadeIn = keyframes`
from { opacity: 0; }
to { opacity: 1; }
`;

const slideDown = keyframes`
from { transform: translateY(-100%); }
to { transform: translateY(0); }
`;

// I hate it but the syntax has to be different here

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  animation: ${fadeIn} 1s ease forwards;
  overflow: scroll;
  z-index: 999;
`;

const ModalContent = styled.div`
  margin-top: 2rem;
  animation: ${slideDown} 1.5s ease forwards;
  overflow: scroll;
`;

function Modal({ children }: { children: ReactNode }) {
  return (
    <ModalOverlay>
      <ModalContent>{children}</ModalContent>
    </ModalOverlay>
  );
}

export default Modal;
