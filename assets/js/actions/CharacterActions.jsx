export const CHARACTERS_CHANGED = 'CHARACTERS_CHANGED';
export const CHARACTER_SELECTED = 'CHARACTER_SELECTED';

function charactersChanged(characters) {
  return {
    type: CHARACTERS_CHANGED,
    characters: characters,
  }
}

function characterSelected(key) {
  return {
    type: CHARACTER_SELECTED,
    active: key,
  }
}

export function setPrimaryCharacter(key) {
  return dispatch => {
    $.ajax({
      url: '/api/character/' + key + '/',
      type: 'POST',
      data: {
        change_primary: true,
      },
    });
    dispatch(characterSelected(key));
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

export function createCharacter(username, data) {
  return dispatch => {
    $.ajax({
      url: '/api/character/new/',
      type: 'POST',
      data: data,
      success: () => {
        window.location = '/my';
      },
    });
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

export function updateCharacter(username, id, data) {
  return dispatch => {
    $.ajax({
      url: '/api/character/' + id + '/',
      type: 'POST',
      data: data,
    });
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
