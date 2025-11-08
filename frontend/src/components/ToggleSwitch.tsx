import { ChangeEvent, FC } from 'react';
import styled from 'styled-components';
import theme from '../common/theme';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  colorOn?: string;
  colorOff?: string;
}

const SwitchContainer = styled.label`
  position: relative;
  display: inline-block;
  width: 68px;
  height: 32px;
  cursor: pointer;
`;

const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
  opacity: 0;
  width: 0;
  height: 0;
`;

const Slider = styled.span`
  position: absolute;
  inset: 0;
  background: #1c2c36;
  border-radius: 30px;
  transition: 0.25s;
  border: 4px solid ${theme.palette.main.accent};
  boxshadow: 0 4px 0 0 ${theme.palette.main.accent};
`;

const Thumb = styled.span<{ checked: boolean; colorOn?: string; colorOff?: string }>`
  position: absolute;
  height: 23px;
  width: 26px;
  top: 3px;
  left: ${(props) => (props.checked ? '36px' : '4px')};
  background: ${(props) =>
    props.checked ? props.colorOn || '#0f6e1b' : props.colorOff || '#631010'};
  box-shadow: 0 3px 0 1px
    ${(props) => (props.checked ? props.colorOn || '#0d5e17' : props.colorOff || '#4f0d0d')};
  border-radius: 50%;
  transition: 0.25s;
`;

const ToggleSwitch: FC<ToggleSwitchProps> = ({ checked, onChange, colorOn, colorOff }) => {
  return (
    <SwitchContainer>
      <HiddenCheckbox checked={checked} onChange={onChange} />
      <Slider />
      <Thumb checked={checked} colorOn={colorOn} colorOff={colorOff} />
    </SwitchContainer>
  );
};

export default ToggleSwitch;
