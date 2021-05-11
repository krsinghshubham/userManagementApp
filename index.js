document.addEventListener('DOMContentLoaded', function () {

  // RFetching users, Read(R) operation.
  const userContainer = document.querySelector('#user-container')
  const userUrl = `http://localhost:3000/users`
  const userForm = document.querySelector('#user-form')
  let allUsers = []


  fetch(`${userUrl}`)
    .then(response => response.json())
    .then(userData => userData.forEach(function (user) {
      allUsers = userData
      userContainer.innerHTML += `

      <div id=${user.id}>
        <img src="${user.avatar}" width="333" height="500" >
        <h2>${user.is_active}</h2>
        <h2>${user.name}</h2>
        <h2>${user.email}</h2>
        <p>>${user.address}</p>
        <h2>${user.phone}</h2>
        <h2>${user.role}</h2>

        <button data-id="${user.id}" id="edit-${user.id}" data-action="edit">Edit</button>
        <button data-id="${user.id}" id="delete-${user.id}" data-action="delete">Delete</button>
      </div>
      <div id=edit-user-${user.id}>
      </div>`
    })) // end of users fetch

  // Adding user, Create(C) operation.
  userForm.addEventListener('submit', (e) => {
    e.preventDefault(); // to make list get refreshed automatically after addition with new user.

    console.log(e.target)

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

  }) // end of addEventListener for adding a user

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
        
        console.log(userData)
        const editedUser = document.querySelector(`#user-${userData.id}`)
        // const editedUser = document.querySelector(`#user-${e.target.dataset.id}`)
        console.log(editedUser)
        
        fetch(`${userUrl}/{userData.id}`, {
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
          })
      }) // end of this event listener for edit submit

      // Deleting user, Delete() operation
    } else if (e.target.dataset.action === 'delete') {
      document.querySelector(`#user-${e.target.dataset.id}`)
      fetch(`${userUrl}/${e.target.dataset.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json())
    }

  })  // end of eventListener for editing and deleting a User

})






