import React from 'react';
import { SelectOption } from './index';

export interface Props {
  name: string;
  initialValue: string;
  options: SelectOption[];
}
export default class extends React.Component<Props> {

}