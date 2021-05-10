document.addEventListener('DOMContentLoaded', function () {

  // RFetching users, Read(R) operation.
  const userContainer = document.querySelector('#user-container')
  const userUrl = `http://localhost:3000/users`
  const userForm = document.querySelector('#user-form')


  fetch(`${userUrl}`)
    .then(response => response.json())
    .then(userData => userData.forEach(function (user) {
      userContainer.innerHTML += `

      <div id=${user.id}>
        <img src="${user.avatar}" width="333" height="500" >
        <h2>${user.is_active}</h2>
        <h2>${user.name}</h2>
        <h2>${user.email}</h2>
        <p>>${user.address}</p>
        <h2>${user.phone}</h2>
        <h2>${user.role}</h2>

        <button data-id="${user.id}" id="edit-${user.id} data-action="edit"> Edit</button>
        <button data-id="${user.id}" id="edit-${user.id} data-action="delete"> Delete</button>
      </div>`
    })) // end of users fetch

  // Adding user, Create(C) operation.
  userForm.addEventListener('submit', (e) => {
    e.preventDefault(); // to make list get refreshed automatically after additon with new user.

    console.log(e.target)

    const nameInput = userForm.querySelector('#name').value
    const emailInput = userForm.querySelector('#email').value
    const phoneInput = userForm.querySelector('#phone').value
    const addressInput = userForm.querySelector('#address').value
    const isActiveInput = userForm.querySelector('#is_active').value
    const roleInput = userForm.querySelector('#role').value
    const avatarInput = userForm.querySelector('#avatar').value



    fetch(`${userUrl}`, {
      method: 'POST',
      body: JSON.stringify({
        name: nameInput,
        email: emailInput,
        phone: phoneInput,
        address: addressInput,
        is_active: isActiveInput,
        role: roleInput,
        avatar: avatarInput
      }),
      headers: {                 // this is necessary to make the fetch api work. (https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#Headers)
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
          <button data-id="${user.id}" id="edit-${user.id} data-action="edit"> Edit</button>
          <button data-id="${user.id}" id="edit-${user.id} data-action="delete"> Delete</button>
        </div>`
      })

  }) // end of addEventListener for adding a user

  // Editing user, Upaate(U) operation.
  userContainer.addEventListener('click', (e) => {
    if(e.target.dataset.action === 'edit') {
      console.log('you pressed edit')
    } else if (e.target.dataset.action === 'delete') {
      console.log('you pressed delete')
    }
  }) // end of eventListener for editing and deleting a User

  

})