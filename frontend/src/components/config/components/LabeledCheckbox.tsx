import styled from 'styled-components';
import theme from '../../../common/theme';
import { lightenColor } from '../../../common/utils';

export const LabeledCheckboxContainer = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  margin: '0.5rem 0',

  '& > :first-child': {
    flex: '0 0 88%',
  },

  gap: '100px',
  color: lightenColor(theme.palette.main.accent, 0.1),
  textShadow: 'none',
});
