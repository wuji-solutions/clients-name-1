import styled from 'styled-components';

export const CustomInput = styled.input({
  width: '90%',
  height: '50px',
  paddingLeft: '20px',
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
  align-items: center; /* centers vertically */
  height: 50px; /* or whatever height you want */
  font-size: 130%;
`;
