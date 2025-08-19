import { styled } from 'styled-components';
import { darkenColor } from '../common/utils';

const AnswerCard = styled.div<{ backgroundcolor: string; isselected: boolean | undefined }>(
  ({ backgroundcolor, isselected }) => {
    const base = backgroundcolor;
    const gradient = isselected
      ? `linear-gradient(135deg, ${darkenColor(base, 0.2)}, ${darkenColor(base, 0.35)})`
      : `linear-gradient(135deg, ${base}, ${darkenColor(base, 0.15)})`;

    return {
      borderRadius: '20px',
      minHeight: '25px',
      width: '10em',
      maxWidth: '500px',
      margin: 'auto',
      padding: '20px',
      background: gradient,
      boxShadow: `0 4px 1px 0 ${darkenColor(base, 0.6)}`,
      border: `2px solid ${darkenColor(base, 0.5)}`,
      transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
      cursor: 'pointer',
      transform: isselected ? 'none' : 'translateY(5px)',
      userSelect: 'none',
      '-webkit-user-select': 'none',
      '-moz-user-select': 'none',
      '-ms-user-select': 'none',
      '-webkit-touch-callout': 'none',
      outline: 'none',
      WebkitTapHighlightColor: 'transparent',
      textAlign: 'center',
      '& h2': {
        margin: 0,
        fontSize: '1rem',
      },
    };
  }
);

export default AnswerCard;
