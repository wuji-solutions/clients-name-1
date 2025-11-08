import styled from 'styled-components';
import theme from '../common/theme';
import { lightenColor } from '../common/utils';

export const CustomInput = styled.input({
  width: '90%',
  height: '50px',
  margin: 'auto',
  border: `4px solid ${theme.palette.main.accent}`,
  boxShadow: `0 3px 0 0 ${theme.palette.main.accent}`,
  borderRadius: '10px',
  backgroundColor: `${lightenColor( theme.palette.main.accent, 0.02)}`,
  fontSize: '19px',
  color: `#fff`,
  fontWeight: '550',
  textAlign: 'center',
  '&::placeholder': {
    fontSize: '15px',
  },
  '&::-webkit-inner-spin-button': {
    '-webkit-appearance': 'none',
  }
});

export const CustomInputFullWidth = styled(CustomInput)`
  width: 100%;
  paddingleft: 0;
`;

// for some reason this does not change component's behavior
// I'm leaving it for clarity on which styles should we add
export const CheckboxInput = styled(CustomInput)`
  width: '3rem';
  margin: 0;
`;

export const CenteredLabel = styled.label`
  display: flex;
  align-items: center;
  height: 50px;
  font-size: 125%;
  max-width: 350px;
`;
