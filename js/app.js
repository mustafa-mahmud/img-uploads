'use strict';

import {
  nameValidation,
  ageValidation,
  passwordValidation,
  imageValidation as imgValidation,
  message,
} from './form-validation.js';

const form = document.querySelector('form');
const inputName = document.querySelector('input[name="name"]');
const inputAge = document.querySelector('input[name="age"]');
const inputPassword = document.querySelector('input[name="password"]');
const inputFile = document.querySelector('input[name="img-file"]');

function formValidation(e) {
  e.preventDefault();

  const name = inputName.value.trim();
  const age = inputAge.value.trim();
  const password = inputPassword.value.trim();
  const imgFile = inputFile.files[0];

  if (
    nameValidation(name, inputName) &&
    ageValidation(age, inputAge) &&
    passwordValidation(password, inputPassword) &&
    imgValidation(imgFile, inputFile)
  ) {
    message('green', 'Everything is okay, Please wait...');
  }
}

/////////////////
form.addEventListener('submit', formValidation);
