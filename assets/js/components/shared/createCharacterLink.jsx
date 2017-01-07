import React from 'react';
import { Link } from 'react-router';

import partyColor from './partyColor';

export default function createCharacterLink(id, party, name) {
  return (
    <Link className={partyColor(party)} to={'/character/' + id}>
      {name}
    </Link>
  );
}
