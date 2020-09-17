import React from 'react';
import { Props } from '../../@types/select';

import styles from './select.module.scss';

export default function(props: Props) {

  return (
    <div>
      <select className={styles["select"]}>
        {props.options.map(_option => (
          <option value={_option.value}>{_option.text}</option>
        ))}
      </select>
    </div>
  )
}