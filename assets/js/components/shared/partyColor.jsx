export default function partyColor(party) {
  if (party[0] === 'D') {
    return 'democratic';
  }
  if (party[0] === 'R') {
    return 'republican';
  }
  if (party[0] === 'I') {
    return 'independent';
  }
}
