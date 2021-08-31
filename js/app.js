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
const inputName = document.querySelector('input[name="insert-name"]');
const inputAge = document.querySelector('input[name="insert-age"]');
const inputPassword = document.querySelector('input[name="insert-password"]');
const inputFile = document.querySelector('input[name="insert-img-file"]');

//Table
const table = document.querySelector('table');
const tbodyEl = document.querySelector('tbody');

//Edit
const editInputName = document.querySelector('input[name="edit-name"]');
const editInputAge = document.querySelector('input[name="edit-age"]');
const editInputImg = document.querySelector('input[name="edit-img-file"]');
const cancelBtns = document.querySelectorAll('.cancel-btn');

//Change Password
const changePassForm = document.querySelector('.pass-change-form');
const oldPassInput = document.querySelector('input[name="old-password"]');
const newPassInput = document.querySelector('input[name="new-password"]');

//Eye
const openEye = document.querySelectorAll('.open-eye');
const closeEye = document.querySelectorAll('.close-eye');

//Show Single User
const showMeBtn = document.querySelector('.ck-me');
const ckMeContainer = document.querySelector('.ck-me-container');
const meForm = document.querySelector('.me-form');
const showMeMsg = document.querySelector('.show-me-msg');
const userResultEl = document.querySelector('.user-result');

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
  oldPassInput.value = newPassInput.value = '';

  window.changePassId = e.target.closest('tr').id;
  insertForm.style.display = 'none';
  editForm.style.display = 'none';
  changePassForm.style.display = 'flex';

  colorTdBorder(e.target.closest('tr'));
}

function defaultFormShow() {
  insertForm.style.display = 'flex';
  editForm.style.display = 'none';
  changePassForm.style.display = 'none';
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
  changePassForm.style.display = 'none';
  editForm.style.display = 'flex';

  window.targetTr = e.target.closest('tr');
  const userName = targetTr.querySelector('.name').textContent;
  const age = targetTr.querySelector('.age').textContent;
  window.oldImg = targetTr.querySelector('img').getAttribute('src');
  window.editId = +targetTr.id;

  clearBorder();
  colorTdBorder(targetTr);
  display4Edit(userName, age);
}

function colorTdBorder(el) {
  clearBorder();

  el.querySelectorAll('td').forEach((td) => {
    td.style.borderTop = '1px solid red';
    td.style.borderBottom = '1px solid red';
  });
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
    defaultFormShow();
  } else {
    message('red', 'Something wrong,Please try again...');
  }
}

function cancelEdit(e = null) {
  e?.preventDefault();

  editInputName.value = editInputAge.value = editInputImg.value = '';
  oldPassInput.value = newPassInput.value = '';

  clearBorder();
  defaultFormShow();
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

  if (data.includes('successfully')) {
    cancelEdit();

    setTimeout(() => {
      read();
    }, 1500);
  } else {
    message('red', 'Something wrong, Please try again...');
  }
}

function passValid(e) {
  e.preventDefault();

  const oldPass = oldPassInput.value.trim();
  const newPass = newPassInput.value.trim();

  if (
    passwordValidation(oldPass, oldPassInput) &&
    passwordValidation(newPass, newPassInput)
  ) {
    changePass();
  }
}

async function changePass() {
  const formData = new FormData(changePassForm);
  formData.append('id', changePassId);

  const res = await fetch('./php/change-pass.php', {
    method: 'post',
    body: formData,
  });

  const data = await res.text();

  if (data.includes('successfully')) {
    message('green', 'Password changed successfully');
    oldPassInput.value = newPassInput.value = '';
    clearBorder();
    defaultFormShow();
  } else {
    message('red', 'Old password is wrong! Please try again.');
  }
}

function eyeToggle(e) {
  const target = e.target.closest('.pass');
  target.classList.toggle('show');

  if (target.classList.contains('show')) {
    target.querySelector('input').type = 'text';
  } else {
    target.querySelector('input').type = 'password';
  }
}

function showUserBox() {
  ckMeContainer.classList.toggle('show');

  if (!ckMeContainer.classList.contains('show')) {
    userResultEl.style.display = 'none';
  }
}

async function showUser(e) {
  e.preventDefault();

  const formData = new FormData(meForm);
  const res = await fetch('./php/single-user.php', {
    method: 'post',
    body: formData,
  });

  const data = await res.text();

  if (!data.includes('wrong')) {
    const parse = JSON.parse(data);
    displayUserUI(parse);
    document.querySelector('input[name="user-name"]').value =
      document.querySelector('input[name="user-password"]').value = '';
  } else {
    userResultEl.style.display = 'none';
    showUserMsg('red', 'Name or Password is wrong, Please try again.');
  }
}

function displayUserUI(data) {
  userResultEl.style.display = 'block';

  userResultEl.querySelector('img').src = `./uploads/${data.img}`;
  userResultEl.querySelector('.name span').textContent = data.name;
  userResultEl.querySelector('.age span').textContent = data.age;
}

function showUserMsg(color, msg) {
  showMeMsg.style.color = color;
  showMeMsg.textContent = msg;

  setTimeout(() => {
    showMeMsg.style.color = 'transparent';
    showMeMsg.textContent = '';
  }, 2000);
}

/////////////////
read();
insertForm.addEventListener('submit', insertValidation);
editForm.addEventListener('submit', editValidation);
openEye.forEach((eye) => eye.addEventListener('click', eyeToggle));
closeEye.forEach((eye) => eye.addEventListener('click', eyeToggle));
changePassForm.addEventListener('submit', passValid);
showMeBtn.addEventListener('click', showUserBox);
meForm.addEventListener('submit', showUser);
ckMeContainer.addEventListener('click', (e) => {
  const target = e.target.classList.contains('ck-me-container');

  if (target) {
    showUserBox();
  }
});
cancelBtns.forEach((el) => {
  el.addEventListener('click', cancelEdit);
});
