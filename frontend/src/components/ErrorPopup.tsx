import { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useError } from '../providers/ErrorProvider';

const fadeIn = keyframes`
  from { opacity: 0; transform: translate(-50%, -20px); }
  to { opacity: 1; transform: translate(-50%, 0); }
`;

const fadeOut = keyframes`
  from { opacity: 1; transform: translate(-50%, 0); }
  to { opacity: 0; transform: translate(-50%, -20px); }
`;

const PopupWrapper = styled.div<{ visible: boolean }>`
  position: fixed;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  animation: ${({ visible }) => (visible ? fadeIn : fadeOut)} 0.3s ease forwards;
`;

const PopupContainer = styled.div`
  background-color: #1f1b1b;
  color: #fff;
  border-radius: 10px;
  border: 4px solid #1a1616;
  box-shadow: 0 4px 0 1px #1a1616;
  padding: 16px 24px;
  display: flex;
  align-items: flex-start;
  max-width: 600px;
  min-width: 200px;
  font-family: 'Inter', Arial, sans-serif;
  font-size: 14px;
  word-wrap: break-word;
`;

const Icon = styled.div`
  font-size: 20px;
  margin-right: 12px;
  flex-shrink: 0;
  margin-top: 1px;
`;

const Message = styled.div`
  flex: 1;
  line-height: 1.4;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: #aaa;
  font-size: 20px;
  cursor: pointer;
  line-height: 1;
  flex-shrink: 0;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #fff;
  }
`;

export function ErrorPopup() {
  const [visible, setVisible] = useState(false);
  const { error, setError } = useError();

  useEffect(() => {
    if (error) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [error]);

  if (!error && !visible) return null;

  return (
    <PopupWrapper visible={!!error}>
      <PopupContainer>
        <Icon>⚠️</Icon>
        <Message>{error}</Message>
        <CloseButton onClick={() => setError(null)}>×</CloseButton>
      </PopupContainer>
    </PopupWrapper>
  );
}

export default ErrorPopup;
