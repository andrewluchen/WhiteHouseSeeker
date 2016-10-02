import AppDispatcher from '../AppDispatcher';
import { CHARACTERS_CHANGED } from './ActionConstants';
import LoginStore from '../stores/LoginStore';

function fetchCharacters() {
  let user = LoginStore.getUser();
  $.get(
    '/api/characters/',
    { user: user ? user.id : '' },
    function (data) {
      AppDispatcher.dispatch({
        actionType: CHARACTERS_CHANGED,
        characters: data,
      });
    },
  );
}

export {
  fetchCharacters,
}
