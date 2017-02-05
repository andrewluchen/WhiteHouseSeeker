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

export function fetchUserCharacters(username) {
  return dispatch => {
    $.ajax({
      url: '/api/characters/',
      type: 'GET',
      data: {
        username: username,
        active: true,
      },
      success: response => {
        let characters = response;
        dispatch(charactersChanged(characters));
      },
    });
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
    $.ajax({
      url: '/api/characters/',
      type: 'GET',
      data: {
        username: username,
      },
      success: response => {
        let characters = response;
        dispatch(charactersChanged(characters));
      },
      error: function(xhr, status, error) {
        alert(xhr.responseText);
        dispatch(loginError(xhr.responseText));
      },
    });
  }
}

export function updateCharacter(username, id, data) {
  return dispatch => {
    $.ajax({
      url: '/api/character/' + id + '/',
      type: 'POST',
      data: data,
    });
    $.ajax({
      url: '/api/characters/',
      type: 'GET',
      data: {
        username: username,
        active: true,
      },
      success: response => {
        let characters = response;
        dispatch(charactersChanged(characters));
      },
    });
  }
}

export function retireCharacter(username, id) {
  return dispatch => {
    $.ajax({
      url: '/api/character/' + id + '/',
      type: 'POST',
      data: {
        deactivate: true
      },
    });
    $.ajax({
      url: '/api/characters/',
      type: 'GET',
      data: {
        username: username,
        active: true,
      },
      success: response => {
        let characters = response;
        dispatch(charactersChanged(characters));
      },
    });
  }
}

export function setPrimaryCharacter(key) {
  return dispatch => {
    $.ajax({
      url: '/api/character/' + key + '/',
      type: 'POST',
      data: {
        make_primary: true,
      },
    });
    dispatch(characterSelected(key));
  }
}
