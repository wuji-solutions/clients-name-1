import styled from 'styled-components';

export const ConfigInput = styled.input({
  display: '15px',
});

export const CleanInput = styled.input({
  height: '40px',
  width: '100%',
  padding: '0 10px',
  border: '1px solid #ccc',
  borderRadius: '8px',
  fontSize: '14px',
  outline: 'none',

  '&:focus': {
    borderColor: '#888',
  },
});
