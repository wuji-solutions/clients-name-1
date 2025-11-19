import styled from 'styled-components';
import theme from '../../../common/theme';

export const LabeledCheckboxContainer = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  width: '33em',
  margin: '0.5rem 0',

  '& > :first-child': {
    flex: '0 0 88%',
  },

  gap: '100px',
  color: theme.palette.main.info_text,
  textShadow: 'none',
});
