import styled from 'styled-components';

export const LabeledCheckboxContainer = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  margin: '0.5rem 0',

  '& > :first-child': {
    flex: '0 0 88%', // don’t grow/shrink, fixed 80%
  },
});
