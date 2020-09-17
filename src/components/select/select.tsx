import React from 'react';
import { Props } from '../../@types/select';
export default function(props: Props) {

  return (
    <div>
      <select>
        {props.options.map(_option => (
          <option value={_option.value}>{_option.text}</option>
        ))}
      </select>
    </div>
  )
}