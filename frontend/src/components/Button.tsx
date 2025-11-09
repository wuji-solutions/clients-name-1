import { styled } from 'styled-components';
import theme from '../common/theme';
import { darkenColor } from '../common/utils';

export const ButtonCustom = styled.button<{color?: string}>(({color}) => {
  
  const color_base = color ? color : theme.palette.button.primary;
  const color_base_accent = color ? darkenColor(color, 0.15) : theme.palette.button.accent;
  return ({
  width: '250px',
  minHeight: '50px',
  marginLeft: 'auto',
  marginRight: 'auto',
  background: color_base,
  border: `2px solid ${color_base_accent}`,
  boxShadow: `0 5px 0 0 ${color_base_accent}`,
  color: '#FFF',
  borderRadius: '10px',
  '&:hover': {
    background: darkenColor(color_base, 0.05),
    border: `1px solid ${darkenColor(color_base, 0.05)}`,
    boxShadow: `0 5px 0 0 ${color_base_accent}`,
    cursor: 'pointer',
  },
  '&:disabled': {
    cursor: 'not-allowed',
    opacity: 0.5,
  },
  '-webkit-transition-duration': '0.2s',
  transitionDuration: '0.2s',
  padding: '7px',
  fontSize: '20px',
  fontWeight: '700',
  textShadow: '1px 1px 1px #000000',
})});

interface ButtonChoseProps {
  active?: boolean;
}

export const ButtonChoose = styled.button<ButtonChoseProps>(({ active }) => ({
  width: '230px',
  height: '40px',
  marginLeft: 'auto',
  marginRight: 'auto',
  background: !active ? '#3377FF' : '#4997FF',
  color: '#FFF',
  border: '1px solid #000',
  borderRadius: '20px',
  boxShadow: !active
    ? '0 3px 4px 0 rgba(0,0,0,0.24),0 4px 12px 0 rgba(0,0,0,0.19)'
    : '0 6px 8px 0 rgba(0,0,0,0.24),0 9px 25px 0 rgba(0,0,0,0.19)',
  '&:hover': {
    boxShadow: '0 6px 8px 0 rgba(0,0,0,0.24),0 9px 25px 0 rgba(0,0,0,0.19)',
  },
  '-webkit-transition-duration': '0.2s',
  transitionDuration: '0.2s',
  padding: '5px',
}));

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if ((elem as any).webkitRequestFullscreen) {
      (elem as any).webkitRequestFullscreen();
    } else if ((elem as any).msRequestFullscreen) {
      (elem as any).msRequestFullscreen();
    }
  } else {
    document.exitFullscreen?.().catch(console.error);
  }
}

const FullScreenButtonPure = styled.button({
  width: '32px',
  height: '32px',
  marginLeft: 'auto',
  marginRight: 'auto',
  background: theme.palette.main.primary,
  color: '#FFF',
  border: '0px solid #000',
  borderRadius: '50%',
  boxShadow: `0 3px 0 0 ${darkenColor(theme.palette.main.primary, 0.1)}`,
  '&:hover': {
    background: darkenColor(theme.palette.main.primary, 0.1),
    boxShadow: `0 3px 0 0 ${darkenColor(theme.palette.main.primary, 0.2)}`,
    cursor: 'pointer',
  },
  '-webkit-transition-duration': '0.2s',
  transitionDuration: '0.2s',
  padding: '7px',
  fontSize: '10px',
  fontWeight: '700',

  position: 'absolute',
  left: '20px',
  top: '20px',
  zIndex: '9999',
});

export const FullScreenButton = () => {
  return <FullScreenButtonPure onClick={toggleFullscreen}>{'< >'}</FullScreenButtonPure>;
};

interface RoundCheckButtonProps {
  selected: boolean;
  onClick: () => void;
}

const CircleButton = styled.button<{ selected: boolean }>`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 3px solid #1c2c36;
  background: ${(props) => (props.selected ? "#1c2c36" : "transparent")};
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.25s;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    transform: scale(1.06);
  }
`;

const RoundCheckButton = ({ selected, onClick }: RoundCheckButtonProps) => {
  return (
    <CircleButton selected={selected} onClick={onClick}>
      {selected ? "✔" : "✕"}
    </CircleButton>
  );
};

export default RoundCheckButton;