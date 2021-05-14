// document.addEventListener('DOMContentLoaded', function () {
//  document.getElementById("user-container").disabled = true;

const userContainer = document.querySelector('#user-container')
const searchBar = document.getElementById('searchBar');
let typedCharacters = [];

const userUrl = `http://localhost:3000/users`

// fetch(`${userUrl}`, {

// })

const userForm = document.querySelector('#user-form')
let allUsers = []

searchBar.addEventListener('keyup', (e) => {
  const searchString = e.target.value.toLowerCase();

  const filteredCharacters = typedCharacters.filter((character) => {
    return (
      character.name.toLowerCase().includes(searchString) ||
      character.email.toLowerCase().includes(searchString) ||
      character.phone.toLowerCase().includes(searchString)
    );
  })
  displayUsers(filteredCharacters)
})

const loadCharacters = async () => {
  try {
    const res = await fetch(`${userUrl}`);
    typedCharacters = await res.json();
    displayUsers(typedCharacters);
    allUsers = typedCharacters
  } catch (err) {
    console.error(err);
  }
};

const displayUsers = (users) => {
  const htmlString = users
    .map((user) => {
      return `
          <li class="user">
            <div id=${user.id}>
              <img class="avatar" src="${user.avatar}" alt="Avatar" >
              <h5 id='user-name'>${user.name}</h5>
              <h5>${user.email}</h5>
              <h5>${user.address}</h5>
              <h5>${user.phone}</h5>
              <h5>${user.role}</h5>
              <div id="modify-buttons">
                <button data-id="${user.id}" id="edit-${user.id}" data-action="edit" class="btn  btn-small btn-secondary active btn-block">Edit</button>
                <button data-id="${user.id}" id="delete-${user.id}" data-action="delete" type="button" class="btn  btn-small active btn-danger btn-block" >Delete</button>
              </div>
            </div>
            <div id=edit-user-${user.id}>
            </div>
          </li>`
    })
    .join('');

  userContainer.innerHTML = htmlString;

  var div_list = document.querySelectorAll('.avatar') // querySelectorAll returns a Nodelist object which is similar to an array but NOT an array
  var div_array = [...div_list];

  div_array.forEach((div, index) => {
    // console.log(index)
    if (users[index].is_active === true) {
      div.style.border = '10px solid rgb(108, 166, 111)';
    }
    else {
      div.style.border = '10px solid #581d38';

    }
  });


}


loadCharacters();
// -------------------------------------------------------------------------------------------------

// Adding user, Create(C) operation.

userForm.addEventListener('submit', (e) => {

  e.preventDefault(); // to make list get refreshed automatically after addition with new user.
  // console.log(e.target)
  const nameInput = userForm.querySelector('#name').value
  const emailInput = userForm.querySelector('#email').value
  const phoneInput = userForm.querySelector('#phone').value
  const addressInput = userForm.querySelector('#address').value
  const is_activeInput = userForm.querySelector('#is_active').value
  const roleInput = userForm.querySelector('#role').value
  const avatarInput = userForm.querySelector('#avatar').value
  fetch(`${userUrl}`, {
    method: 'POST',
    body: JSON.stringify({
      name: nameInput,
      email: emailInput,
      phone: phoneInput,
      address: addressInput,
      is_active: is_activeInput,
      role: roleInput,
      avatar: avatarInput
    }),
    headers: { // this is necessary to make the fetch api work. (https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#Headers)
      'Content-Type': 'application/json'
    }
  }).then(response => response.json())
    .then(user => {
      userContainer.innerHTML += `
        <div id=${user.id}>
          <img src="${user.avatar}" width="333" height="500" >
          <h2>${user.is_active}</h2>
          <h2>${user.name}</h2>
          <h2>${user.email}</h2>
          <p>>${user.address}</p>
          <h2>${user.phone}</h2>
          <h2>${user.role}</h2>
          <button data-id="${user.id}" id="edit-${user.id}" data-action="edit"> Edit</button>
          <button data-id="${user.id}" id="delete-${user.id}" data-action="delete"> Delete</button>
        </div>
        <div id=edit-user-${user.id}>
        </div>`
    })
}) // end of addEventListener // end of addEventListener for adding a user
// -------------------------------------------------------------------------------------

// Editing user, Update(U) operation.
userContainer.addEventListener('click', (e) => {
  if (e.target.dataset.action === 'edit') {

    const editButton = document.querySelector(`#edit-${e.target.dataset.id}`)
    editButton.disabled = true

    const userData = allUsers.find((user) => {
      return user.id == e.target.dataset.id
    })
    const editForm = userContainer.querySelector(`#edit-user-${e.target.dataset.id}`)
    editForm.innerHTML = `
        <form class='form' id='edit-user' action ='index.html' method='post'>
          <form id ="user-form">
              <input id="edit-name" placeholder="${userData.name}">
              <input id="edit-email" placeholder="${userData.email}">
              <input id="edit-phone" placeholder="${userData.phone}">
              <input id="edit-address" placeholder="${userData.address}">
              <input id="edit-is_active" placeholder="${userData.is_active}">
              <input id="edit-role" placeholder="${userData.role}">
              <input id="edit-avatar" placeholder="${userData.avatar}">
              <input type="submit" value="Edit User">
          </form>
        </form>`

    editForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const nameInput = document.querySelector("#edit-name").value
      const emailInput = editForm.querySelector("#edit-email").value
      const phoneInput = document.querySelector("#edit-phone").value

      const addressInput = document.querySelector("#edit-address").value
      const is_activeInput = document.querySelector("#edit-is_active").value
      const roleInput = document.querySelector("#edit-role").value
      const avatarInput = document.querySelector("#edit-avatar").value

      const editedUser = document.querySelector(`#edit-user-${userData.id}`)

      fetch(`${userUrl}/${userData.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          name: nameInput,
          email: emailInput,
          phone: phoneInput,
          address: addressInput,
          is_active: is_activeInput,
          role: roleInput,
          avatar: avatarInput
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json())
        .then(user => {
          editedUser.innerHTML = `
          <div id=${user.id}>
            <img src="${user.avatar}" width="333" height="500" >
            <h2>${user.is_active}</h2>
            <h2>${user.name}</h2>
            <h2>${user.email}</h2>
            <p>>${user.address}</p>
            <h2>${user.phone}</h2>
            <h2>${user.role}</h2>
            <button data-id="${user.id}" id="edit-${user.id}" data-action="edit"> Edit</button>
            <button data-id="${user.id}" id="delete-${user.id}" data-action="delete"> Delete</button>
          </div>
          <div id=edit-user-${user.id}>
          </div>`
          editForm.innerHTML = ""
          window.location.reload(); // refresh the page after the edit is made.
        })
    }) // end of this event listener for edit submit
    // -------------------------------------------------------------------------------------
    
    // Deleting user, Delete() operation
  } else if (e.target.dataset.action === 'delete') {

    // $('#myModal').on('show.bs.modal');
    $('#myModal').modal('show')
    $('#myModal .modal-footer button').on('click', function (event) {
      var $button = $(event.target);

      $(this).closest('.modal').one('hidden.bs.modal', function () {
        console.log('now inside this function')
        if ($button[0].id == "confirm-delete") {
          console.log('delete button pressed')
          deleteUser(e.target.dataset.id)
        }
        else {
          console.log('cancel button pressed')
        }
        //  alert('The buttons id that closed the modal is: ' + $button[0].id) ;
      });
    });

  }
})  // end of eventListener for editing and deleting a User

// -------------------------------------------------------------------------------------

function deleteUser(targetDatasetId) {

  document.querySelector(`#user-${targetDatasetId}`)
  fetch(`${userUrl}/${targetDatasetId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(response => response.json())

}
