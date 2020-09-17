import React from 'react';
import Select from '../../components/select/select';

import { SelectOption } from '../../@types/index';

const options: SelectOption[] = [
  {text: 'item 1', value: 'value 1'},
  {text: 'item 2', value: 'value 2'},
  {text: 'item 3', value: 'value 3'}
]
export default function() {

  return (
    <Select name="s" initialValue={options[options.length - 1].value} options={options} />
  )
}