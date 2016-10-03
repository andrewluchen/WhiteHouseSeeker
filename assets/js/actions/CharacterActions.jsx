export const CHARACTERS_CHANGED = 'CHARACTERS_CHANGED';

function charactersChanged(characters) {
  return {
    type: CHARACTERS_CHANGED,
    characters: characters,
  }
}

export function fetchUserCharacters(username) {
  return dispatch => {
    $.get(
      '/api/characters/',
      { username: username },
      data => {
        let characters = data;
        dispatch(charactersChanged(characters));
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
