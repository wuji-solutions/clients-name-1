import { useState, useEffect, useRef } from 'react';
import { styled } from 'styled-components';
import { service } from '../service/service';
import theme from '../common/theme';
import { darkenColor } from '../common/utils';

const Clock = styled.div<{timeLeft: number}>(({timeLeft}) => ({
  backgroundColor: theme.palette.main.primary,
  boxShadow: `0 5px 0 0 ${darkenColor(theme.palette.main.primary, 0.1)}`,
  color: timeLeft > 90 ? '#fff' : '#c91c25',
  width: '100px',
  borderRadius: '10px',
  height: '40px',
  textAlign: 'center',
  alignContent: 'center',
  letterSpacing: '2px',
  fontSize: '22px',
}));

function Timer({isAdmin}: {isAdmin?: boolean}) {
  const [initialSeconds, setInitialSeconds] = useState<number>();
  const [examTimeRemaining, setExamTimeRemaining] = useState<number>();
  const endTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (isAdmin) {
      service.getExamTimeRemainingAdmin().then((response) => {
        if (response.data.minutes + response.data.seconds < 0) {
          setInitialSeconds(0);
        } else {
          setInitialSeconds(response.data.minutes * 60 + response.data.seconds);
        }
      });
    } else {
      service.getExamTimeRemainingUser().then((response) => {
        if (response.data.minutes + response.data.seconds < 0) {
          setInitialSeconds(0);
        } else {
          setInitialSeconds(response.data.minutes * 60 + response.data.seconds);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (initialSeconds) endTimeRef.current = Date.now() + initialSeconds * 1000;

    const tick = () => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((endTimeRef.current! - now) / 1000));
      setExamTimeRemaining(diff);

      if (diff <= 0) {
        clearInterval(interval);
      }
    };

    const interval = setInterval(tick, 1000);
    tick(); // call immediately so UI updates without delay

    return () => clearInterval(interval);
  }, [initialSeconds]);

  return (
    <>
      {examTimeRemaining != null && initialSeconds && (
        <Clock timeLeft={examTimeRemaining}>
          {`${Math.floor(examTimeRemaining / 60)}:${examTimeRemaining % 60 >= 10 ? examTimeRemaining % 60 : '0' + (examTimeRemaining % 60)}`}
        </Clock>
      )}
    </>
  );
}

export default Timer;
