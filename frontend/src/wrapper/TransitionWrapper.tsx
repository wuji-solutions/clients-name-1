import { keyframes, styled } from 'styled-components';
import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  animation: ${fadeIn} 0.25s ease forwards;
`;

const TransitionWrapper = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  return <Wrapper key={location.pathname}>{children}</Wrapper>;
};

export default TransitionWrapper;
