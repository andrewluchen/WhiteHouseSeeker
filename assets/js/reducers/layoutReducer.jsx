import { SIDEBAR_TOGGLED } from '../actions/LayoutActions';

function layout(state = {
    collapsed: false,
  }, action) {
  switch (action.type) {
    case SIDEBAR_TOGGLED:
    default:
      return state;
  }
}

export default layout;
