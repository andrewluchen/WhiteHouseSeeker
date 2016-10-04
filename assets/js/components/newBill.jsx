import React from 'react';
import BillEditor from './Bill/BillEditor';

export default function newBill(house) {
  if (house === 'house') {
    return () =>
      <BillEditor
        house={house}
        header="House Hopper"
        titlePlaceholder='Legislation Name'
        title=''
        content=''
        endpoint='/api/bill/new/'
        verb='POST'
        redirect='/house'
      />
  } else if (house === 'senate') {
    return () =>
      <BillEditor
        house={house}
        header="Senate Clerk's Office"
        titlePlaceholder='Legislation Name'
        title=''
        content=''
        endpoint='/api/bill/new/'
        verb='POST'
        redirect='/senate'
      />
  }
}
