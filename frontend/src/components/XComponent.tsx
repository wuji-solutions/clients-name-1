import { styled } from 'styled-components';

const XShape = styled.div`
  width: 15px;
  height: 15px;
  margin: auto;
  aspect-ratio: 1;
  background: #750808;
  clip-path: polygon(
    0 20%,
    20% 0,
    50% 30%,
    80% 0,
    100% 20%,
    70% 50%,
    100% 80%,
    80% 100%,
    50% 70%,
    20% 100%,
    0 80%,
    30% 50%
  );
`;

export default XShape;