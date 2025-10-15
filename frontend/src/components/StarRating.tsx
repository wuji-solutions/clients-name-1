import { styled } from 'styled-components';

const Star = styled.div({
  width: '15px',
  height: '15px',
  margin: 'auto',
  aspectRatio: 1,
  background: '#F8CA00',
  clipPath:
    'polygon(50% 0, calc(50%*(1 + sin(.4turn))) calc(50%*(1 - cos(.4turn))), calc(50%*(1 - sin(.2turn))) calc(50%*(1 - cos(.2turn))), calc(50%*(1 + sin(.2turn))) calc(50%*(1 - cos(.2turn))), calc(50%*(1 - sin(.4turn))) calc(50%*(1 - cos(.4turn))) )',
});

export default Star;
