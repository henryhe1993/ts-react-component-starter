import React from 'react';
import Calendar from '../../components/calendar/calendar';

const TS_FOR_ONE_DAY = 1000 * 60 * 60 * 24;
export default function() {

  const handleClose = React.useCallback(() => {

  }, [])

  const handleOk = React.useCallback(() => {

  }, [])

  return (
    <div>
      <Calendar 
        visible
        start={1561910400000} 
        end={1564156800000}
        maxRange={90 * TS_FOR_ONE_DAY}
        maxDate={getCurrentDayTimestamp()}
        handleClose={handleClose}
        handleOk={handleOk}
      />
    </div>
  )
}

function getCurrentDayTimestamp() {
  const date = new Date();

  return new Date(
    `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
  ).getTime();
};