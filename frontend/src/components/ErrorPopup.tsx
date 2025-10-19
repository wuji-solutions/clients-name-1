import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

interface ErrorPopupProps {
  error: string | null;
  onClose: () => void;
}

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
  background-color: #000;
  color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  padding: 16px 24px;
  display: flex;
  align-items: flex-start;
  max-width: 600px;
  min-width: 400px;
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

interface Props {
  error: string;
  onClose: any;
}

export function ErrorPopup({ error, onClose }: Props) {
  const [visible, setVisible] = useState(false);

  React.useEffect(() => {
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
        <CloseButton onClick={onClose}>×</CloseButton>
      </PopupContainer>
    </PopupWrapper>
  );
}

export default ErrorPopup;
