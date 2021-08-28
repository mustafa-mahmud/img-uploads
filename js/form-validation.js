const msgEl = document.querySelector('.msg');

function nameValidation(name, input) {
  const pattenrs = /^[a-zA-Z\s]+$/g;

  if (name) {
    if (pattenrs.test(name)) {
      if (name.length > 2) {
        return true;
      } else {
        message('red', 'Name must be up to 2 characters', input);
      }
    } else {
      message('red', 'Name only string are valid', input);
    }
  } else {
    message('red', 'Name is required', input);
  }
}

function ageValidation(age, input) {
  const patterns = /^[0-9]+$/g;
  if (age) {
    if (patterns.test(age) && String(age).length < 4) {
      return true;
    } else {
      message('red', 'Only age are accepted', input);
    }
  } else {
    message('red', 'Age is required', input);
  }
}

function passwordValidation(pass, input) {
  if (String(pass).length > 4) {
    return true;
  } else {
    message('red', 'Password minimum must be 5 digit', input);
  }
}

function imageValidation(img, input) {
  if (!img) return message('red', 'Image is required', input);

  const type = img.type.split('/').pop().toLowerCase();
  const size = img.size;
  const validType = ['jpeg', 'jpg', 'png', 'gif'];

  if (validType.includes(type)) {
    if (size < 300000) {
      input.style.border = 'none';
      return true;
    } else {
      message('red', 'Image size must be in 3mb', input);
    }
  } else {
    message('red', 'Image type must be jpeg,jpg,png or gif', input);
  }
}

function message(color, msg, input = null) {
  msgEl.style.color = color;
  msgEl.textContent = msg;

  if (input !== null) input.style.border = `2px solid ${color}`;

  setTimeout(() => {
    msgEl.style.color = 'transparent';
    msgEl.textContent = '';
    if (input !== null) input.style.border = `2px solid black`;
  }, 2000);
}

export {
  nameValidation,
  ageValidation,
  passwordValidation,
  imageValidation,
  message,
};
