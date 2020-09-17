import React from 'react';

export interface Props {
  start: number;
	end: number;
	maxRange: number
	visible: boolean;
  maxDate: number;
	handleClose(): void;
  handleOk({start: number, end: number}): void;
}
export default class extends React.Component<Props> {

}