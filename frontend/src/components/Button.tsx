import { styled } from 'styled-components';
import theme from '../common/theme';

export const ButtonCustom = styled.button({
    width: '250px',
    minHeight: '50px',
    marginLeft: 'auto',
    marginRight: 'auto',
    background: theme.palette.button.primary,
    color: '#FFF',
    border: '1px solid #000',
    borderRadius: '7px',
    boxShadow: '0 3px 4px 0 rgba(0,0,0,10)',
    '&:hover': {
        // boxShadow: '0 6px 8px 0 rgba(0,0,0,0.24),0 9px 25px 0 rgba(0,0,0,0.19)'
        zoom: 1.025,
    },
    '-webkit-transition-duration': '0.2s',
    transitionDuration: '0.2s',
    padding: '7px',
    fontSize: '20px',
    fontWeight: '700'
})

interface ButtonChoseProps {
    active?: boolean;
}

export const ButtonChoose = styled.button<ButtonChoseProps>(({ active }) => ({
    width: '230px',
    height: '40px',
    marginLeft: 'auto',
    marginRight: 'auto',
    background: !active ? "#3377FF" : "#4997FF",
    color: '#FFF',
    border: '1px solid #000',
    borderRadius: '20px',
    boxShadow: !active ? '0 3px 4px 0 rgba(0,0,0,0.24),0 4px 12px 0 rgba(0,0,0,0.19)' : '0 6px 8px 0 rgba(0,0,0,0.24),0 9px 25px 0 rgba(0,0,0,0.19)',
    '&:hover': {
        boxShadow: '0 6px 8px 0 rgba(0,0,0,0.24),0 9px 25px 0 rgba(0,0,0,0.19)'
    },
    '-webkit-transition-duration': '0.2s',
    transitionDuration: '0.2s',
    padding: '5px',
}))