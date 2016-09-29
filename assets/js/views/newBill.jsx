import React from 'react';
import NewBill from '../components/Bill/NewBill';

export default function newBill(house) {
  if (house === 'house') {
    return () => <NewBill house={house} header="House Hopper" endpoint='/api/bill/new/' redirect='/senate'/>
  } else if (house === 'senate') {
    return () => <NewBill house={house} header="Senate Clerk's Office" endpoint='/api/bill/new/' redirect='/house'/>
  }
}
