import { styled } from 'styled-components';
import { darkenColor } from '../common/utils';

const AnswerCard = styled.div<{ backgroundcolor: string; isselected: boolean | undefined, usegradient?: boolean }>(
  ({ backgroundcolor, isselected, usegradient }) => {
    const base: string = backgroundcolor;
    let bg;
    if (usegradient) {
      bg = isselected
        ? `linear-gradient(135deg, ${darkenColor(base, 0.2)}, ${darkenColor(base, 0.35)})`
        : `linear-gradient(135deg, ${base}, ${darkenColor(base, 0.15)})`;
    } else {
      bg = isselected ? darkenColor(base, 0.1) :  base;
    }

    return {
      color: isselected ? '#dee0e0' : '#fff',
      borderRadius: '20px',
      minHeight: '25px',
      width: 'fit-content',
      minWidth: '100px',
      maxWidth: '300px',
      margin: 'auto',
      padding: '20px',
      background: bg,
      boxShadow: `0 5px 1px 1px ${ isselected ? darkenColor(base, 0.16) : darkenColor(base, 0.06)}`,
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
