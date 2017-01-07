export const SIDEBAR_TOGGLED = 'SIDEBAR_TOGGLED';

function sidebarToggled() {
  return {
    type: SIDEBAR_TOGGLED,
  }
}

export function toggleSidebar() {
  return dispatch => {
    dispatch(sidebarToggled());
  }
}
