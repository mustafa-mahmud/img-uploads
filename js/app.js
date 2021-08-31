'use strict';

import {
  nameValidation,
  ageValidation,
  passwordValidation,
  imageValidation as imgValidation,
  message,
  clearAll,
} from './form-validation.js';

//Insert
const insertForm = document.querySelector('.insert-form');
const editForm = document.querySelector('.edit-form');
const inputName = document.querySelector('input[name="name"]');
const inputAge = document.querySelector('input[name="age"]');
const inputPassword = document.querySelector('input[name="password"]');
const inputFile = document.querySelector('input[name="img-file"]');

//Table
const table = document.querySelector('table');
const tbodyEl = document.querySelector('tbody');

//Edit
const editInputName = document.querySelector('input[name="edit-name"]');
const editInputAge = document.querySelector('input[name="edit-age"]');
const editInputImg = document.querySelector('input[name="edit-img-file"]');
const cancelBtn = document.querySelector('.cancel-btn');
const editBtn = document.querySelector('.edit-btn');

//Change Password
const changePassForm = document.querySelector('.pass-change-form');

//Eye
const openEye = document.querySelectorAll('.open-eye');
const closeEye = document.querySelectorAll('.close-eye');

function insertValidation(e) {
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
    const formData = new FormData(insertForm);

    if (insertForm.classList.contains('insert-form')) insertData(formData);
  }
}

async function insertData(datas) {
  const res = await fetch('./php/insert.php', {
    method: 'post',
    body: datas,
  });

  const data = await res.text();

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

  if (!data) {
    table.style.display = 'none';
    return;
  }

  if (data.length) {
    displayUI(data);
  }
}

function displayUI(datas) {
  table.style.display = 'table';
  tbodyEl.innerHTML = '';
  datas.forEach((el, ind) => {
    const html = `
		<tr id="${el.id}">
			<td class="sl">${ind + 1}</td>
			<td class="name">${el.name}</td>
			<td class="age">${el.age}</td>
			<td class="imgs">
				<img width="50" height="30" src="uploads/${el.img}" alt="${el.name}" />
			</td>
			<td class="action">
				<span class="change-password">Change Password</span> |
				<span class="edit">Edit</span> |
				<span class="delete">Delete</span>
			</td>
		</tr>
		`;

    tbodyEl.insertAdjacentHTML('afterbegin', html);
  });

  const dels = tbodyEl.querySelectorAll('.delete');
  const edits = tbodyEl.querySelectorAll('.edit');
  const pass = tbodyEl.querySelectorAll('.change-password');

  dels.forEach((del) => del.addEventListener('click', idCheck));
  edits.forEach((edit) => edit.addEventListener('click', editCheck));
  pass.forEach((edit) => edit.addEventListener('click', passCheck));
}

function passCheck(e) {
  insertForm.style.display = 'none';
  editForm.style.display = 'none';
  changePassForm.style.display = 'flex';
}

function idCheck(e) {
  const user = confirm('Are your sure to delete?');

  if (!user) return;

  const id = e.target.closest('tr').id;
  const src = e.target.closest('tr').querySelector('img').getAttribute('src');

  if (id) {
    deleteUser(id, src);
  }
}

function editCheck(e) {
  insertForm.style.display = 'none';
  editForm.style.display = 'flex';

  window.targetTr = e.target.closest('tr');
  const userName = targetTr.querySelector('.name').textContent;
  const age = targetTr.querySelector('.age').textContent;
  window.oldImg = targetTr.querySelector('img').getAttribute('src');
  window.editId = +targetTr.id;

  clearBorder();

  targetTr.querySelectorAll('td').forEach((td) => {
    td.style.borderTop = '1px solid red';
    td.style.borderBottom = '1px solid red';
  });

  display4Edit(userName, age);
}

function clearBorder() {
  tbodyEl.querySelectorAll('td').forEach((td) => {
    td.style.borderTop = 'none';
    td.style.borderBottom = 'none';
  });
}

function display4Edit(userName, age) {
  editInputName.value = userName;
  editInputAge.value = age;
}

async function deleteUser(id, src) {
  const res = await fetch('./php/delete.php', {
    method: 'post',
    body: JSON.stringify({ id, img: src }),
  });

  const data = await res.text();
  if (data.includes('successfully')) {
    message('green', 'Delete Successfully');
    read();
  } else {
    message('red', 'Something wrong,Please try again...');
  }
}

function cancelEdit(e = null) {
  e?.preventDefault();

  insertForm.style.display = 'flex';
  editForm.style.display = 'none';

  editInputName.value = editInputAge.value = editInputImg.value = '';
}

function editValidation(e) {
  e.preventDefault();

  const name = editInputName.value.trim();
  const age = editInputAge.value.trim();
  const imgFile = editInputImg.files[0];

  if (
    nameValidation(name, editInputName) &&
    ageValidation(age, editInputAge) &&
    imgFile
      ? imgValidation(imgFile, editInputImg)
      : true
  ) {
    message('green', 'Everything is okay, Please wait...');
    const formData = new FormData(editForm);
    formData.append('id', editId);
    formData.append('old-img', oldImg);

    if (editForm.classList.contains('edit-form')) editData(formData);
  }
}

async function editData(datas) {
  const res = await fetch('./php/edit.php', {
    method: 'post',
    body: datas,
  });

  const data = await res.text();
  console.log(data);

  if (data.includes('successfully')) {
    cancelEdit();
    setTimeout(() => {
      read();
    }, 1500);
  } else {
    message('red', 'Something wrong, Please try again...');
  }
}

function eyeToggle(e) {
  console.log(123);
  const target = e.target.closest('.pass');
  target.classList.toggle('show');

  if (target.classList.contains('show')) {
    target.querySelector('input').type = 'text';
  } else {
    target.querySelector('input').type = 'password';
  }
}

/////////////////
read();
insertForm.addEventListener('submit', insertValidation);
cancelBtn.addEventListener('click', cancelEdit);
editForm.addEventListener('submit', editValidation);
openEye.forEach((eye) => eye.addEventListener('click', eyeToggle));
closeEye.forEach((eye) => eye.addEventListener('click', eyeToggle));
