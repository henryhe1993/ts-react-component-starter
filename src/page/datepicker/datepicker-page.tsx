import React from 'react';
import Datepicker from '../../components/datepicker/datepicker';

const ts = Date.now();
export default function() {

  return (
    <Datepicker timestamp={ts} 
      onOk={() => {}}
      onDismiss={() => {}}
    />
  )
}