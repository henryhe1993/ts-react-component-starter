import React from 'react';
import { Props } from '../../@types/input';

import styles from './input.module.scss';
export default function(props: Props) {
  const [value, setValue] = React.useState(props.initialValue);

  return (
    <div>
      <input className={styles["input"]}
        name={props.name} 
        value={value}
        onChange={e => setValue(e.target.value)}
      />
    </div>
  )
}