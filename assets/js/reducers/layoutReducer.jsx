import { SIDEBAR_TOGGLED } from '../actions/LayoutActions';

function layout(state = {
    showSidebar: true,
  }, action) {
  switch (action.type) {
    case SIDEBAR_TOGGLED:
      return Object.assign({}, state, {
        showSidebar: !state.showSidebar,
      });
    default:
      return state;
  }
}

export default layout;
