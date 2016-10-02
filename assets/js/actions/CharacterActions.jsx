export const CHARACTERS_CHANGED = 'CHARACTERS_CHANGED';

function changeCharacters(characters) {
  return {
    type: CHARACTERS_CHANGED,
    characers: characters,
  }
}

export function fetchUserCharacters(user) {
  return dispatch => {
    if (!user) {
      return;
    }
    $.get(
      '/api/characters/',
      { user: user ? user.id : '' },
      data => {
        dispatch(changeCharacters(characters));
      },
    );
  }
}

export function createCharacter(data) {
  return dispatch => {
    $.ajax({
      url: '/api/character/',
      type: 'POST',
      data: data,
    });
  }
}
