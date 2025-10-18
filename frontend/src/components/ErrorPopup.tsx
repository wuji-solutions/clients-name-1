import React from 'react';
import styled, { keyframes } from 'styled-components';

interface ErrorPopupProps {
  error: string | null;
  onClose: () => void;
}

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const fadeOut = keyframes`
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(-20px); }
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
  align-items: center;
  max-width: 420px;
  font-family: 'Inter', Arial, sans-serif;
  font-size: 14px;
`;

const Icon = styled.div`
  font-size: 20px;
  margin-right: 10px;
`;

const Message = styled.div`
  flex: 1;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: #aaa;
  font-size: 20px;
  cursor: pointer;
  margin-left: 10px;
  line-height: 1;

  &:hover {
    color: #fff;
  }
`;

const ErrorPopup: React.FC<ErrorPopupProps> = ({ error, onClose }) => {
  const [visible, setVisible] = React.useState(false);

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
};

export default ErrorPopup;
