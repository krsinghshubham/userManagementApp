const userUrl = `http://localhost:3000/users`
const userContainer = document.querySelector('#user-container')
const searchBar = document.getElementById('searchBar');
const userForm = document.querySelector('#user-form')

var allUsers = []
const loadUsers = async () => {   // using const instead of function to create function because It makes the function immutable, so you don't have to worry about that function being changed by some other piece of code.
  const res = await fetch(`${userUrl}`);
  allUsers = await res.json();
  displayUsers(allUsers);
};
//--------------------------------Search and Display----------------------------------------
searchBar.addEventListener('keyup', (e) => {
  const searchString = e.target.value.toLowerCase();

  const filteredUsers = allUsers.filter((user) => {
    return (
      // user.is_active==false
      user.name.toLowerCase().includes(searchString) ||
      user.email.toLowerCase().includes(searchString) ||
      user.phone.toLowerCase().includes(searchString)
    );
  })
  displayUsers(filteredUsers)
})

// TODO: Push the selected label of filters to top to show which option is selected, Refer commented function below

// $(function(){
//   $("#dropdown-menu-role li a").click(function(){ 
//     $(".btn:first-child").text($(this).text());
//   });
// });

function statusFilter(filter) {
  if (filter == "any") {
    displayUsers(allUsers)
  }
  if (filter == "active") {
    const filteredUsers = allUsers.filter((user) => {
      return (
        user.is_active == true
      );
    })
    displayUsers(filteredUsers)
  }
  if (filter == "inActive") {
    const filteredUsers = allUsers.filter((user) => {
      return (
        user.is_active == false
      );
    })
    displayUsers(filteredUsers)

  }
  if (filter == "admin") {
    const filteredUsers = allUsers.filter((user) => {
      return (
        user.role == "ADMIN"
      );
    })
    displayUsers(filteredUsers)
  }
  if (filter == "member") {
    const filteredUsers = allUsers.filter((user) => {
      return (
        user.role == "MEMBER"
      );
    })
    displayUsers(filteredUsers)

  }
  if (filter == "guest") {
    const filteredUsers = allUsers.filter((user) => {
      return (
        user.role == "GUEST"
      );
    })
    displayUsers(filteredUsers)

  }
}

// [const | let | var] = function () {} (or () => 
// Is the creation of an anonymous function (function () {}) and the creation of a variable, and then the assignment of that anonymous function to that variable.
// So the usual rules around variable hoisting within a scope -- block-scoped variables (let and const) do not hoist as undefined to the top of their block scope.

const displayUsers = (users) => {
  const htmlString = users
    .map((user) => {
      return `
          <li class="user">
            <div id=${user.id}>
              <img class="avatar" src="${user.avatar}" alt="Avatar" >
              <h5 id='user-name'>${user.name}</h5>
              <h5>${user.email}</h5>
              <h5 class="user-address">${user.address}</h5>
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
    }
    )
    .join('');
  userContainer.innerHTML = htmlString;
  // ----------------------------------------------------Show user status in form of colors as green for active and default for inActive---------------------------------------------------------------
  var div_list = document.querySelectorAll('.avatar') // querySelectorAll returns a Nodelist object which is similar to an array but NOT an array

  var div_array = [...div_list];
  div_array.forEach((div, index) => {
    if (users[index].is_active === true) {
      div.style.border = '10px solid rgb(108, 166, 111)';
    }
    else {
      div.style.border = '10px solid #581d38';
    }
  });

}
loadUsers();
// --------------------------------------------------------------------------------------------------------------------------------
// Adding user, Create(C) operation.
document.getElementById("addUser").addEventListener("click", ()=>{
  $('#newUserModal').modal('show')

});

// this is necessary to make the fetch api work. (https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#Headers)
 // end of addEventListener
// -------------------------------------------------------------------------------------

// Additing, Editing user, Updating(U) operation.
userContainer.addEventListener('click', (e) => {
  if (e.target.dataset.action === 'edit') {
    const userData = allUsers.find((user) => {
      return user.id == e.target.dataset.id
    })
    var form = document.getElementById("editForms");
    form["Id"].value = userData.id;
    form["editName"].value = userData.name;
    form["editEmail"].value = userData["email"];
    form["editAddress"].value = userData["address"];
    form["editPhone"].value = userData["phone"];
    form["editRole"].value = userData["role"];
    form["editStatus"].value = userData["is_active"]
    $('#editModal').modal('show')

    // end of this event listener for edit 
    // -------------------------------------------------------------------------------------------------------------------------------
    // Deleting user, Delete() operation
  } else if (e.target.dataset.action === 'delete') {
    $('#deleteModal').modal('show')
    $('#deleteModal .modal-footer button').on('click', function (event) {
      var $button = $(event.target);
      $(this).closest('.modal').one('hidden.bs.modal', function () {
        if ($button[0].id == "confirm-delete") {
          deleteUser(e.target.dataset.id)
        }
        else {
          console.log('cancel button pressed')
        }
      });
    });
  }
})  // end of eventListener delete

function deleteUser(targetDatasetId) {

  document.querySelector(`#user-${targetDatasetId}`)
  fetch(`${userUrl}/${targetDatasetId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(response => response.json())
}

function editUser(formData) {
  let status= true
  // console.log(typeof status)
  if(formData["editStatus"].value==="false"){
    status=false
  }

  fetch(`${userUrl}/${formData["Id"].value}`, {
    method: 'PATCH',
    body: JSON.stringify({
      name: formData["editName"].value,
      email: formData["editEmail"].value,
      phone: formData["editPhone"].value,
      address: formData["editAddress"].value,
      is_active: status,
      role: formData["editRole"].value,
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(response => response.json())
    .then(window.location.reload()); // refresh the page after the edit is made.
}
function addNewUser(formData) {
  fetch(`${userUrl}`, {
    method: 'POST',
    body: JSON.stringify({
      name: formData["addName"].value,
      email: formData["addEmail"].value,
      phone: formData["addPhone"].value,
      address: formData["addAddress"].value,
      is_active: formData["addStatus"].value,
      role: formData["addRole"].value,
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(response => response.json())
    .then(window.location.reload()); // refresh the page after the add is made.
}
// ----------------------------------------------------------------------------------------------------------------------------------------

