'use strict';

import {
  nameValidation,
  ageValidation,
  passwordValidation,
  imageValidation as imgValidation,
  message,
  clearAll,
} from './form-validation.js';

const form = document.querySelector('form');
const inputName = document.querySelector('input[name="name"]');
const inputAge = document.querySelector('input[name="age"]');
const inputPassword = document.querySelector('input[name="password"]');
const inputFile = document.querySelector('input[name="img-file"]');
const tbodyEl = document.querySelector('tbody');

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
    const formData = new FormData(form);

    if (form.classList.contains('insert')) insertData(formData);
  }
}

async function insertData(datas) {
  const res = await fetch('./php/insert.php', {
    method: 'post',
    body: datas,
  });

  const data = await res.text();

  console.log(data);
  if (data.includes('successfully')) {
    clearAll(inputName, inputAge, inputPassword, inputFile);
    message('green', 'Inserted Successfully');
    read();
  } else {
    message('red', 'Something went wrong, Please try again...');
  }
}

async function read() {
  const res = await fetch('./php/read.php');
  const data = await res.json();

  console.log(data);
  if (data) {
    displayUI(data);
  }
}

function displayUI(datas) {
  tbodyEl.innerHTML = '';
  datas.forEach((el, ind) => {
    const html = `
		<tr id="${el.id}">
			<td>${ind + 1}</td>
			<td>${el.name}</td>
			<td>${el.age}</td>
			<td>
				<img width="50" height="30" src="uploads/${el.img}" alt="${el.name}" />
			</td>
			<td>
				<span class="change-password">Change Password</span> |
				<span class="edit">Edit</span> |
				<span class="delete">Delete</span>
			</td>
		</tr>
		`;

    tbodyEl.insertAdjacentHTML('afterbegin', html);
  });
}

/////////////////
read();
form.addEventListener('submit', formValidation);
