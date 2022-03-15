
// var // variavel escopo global
// let // variavel escopo fechado
// const // constante = nao pode ser reatribuito um novo valor

const url = 'http://localhost:3000/users';
const lista = document.getElementById('lista');
var editMode = false;
var idEdit = 0;

// INPUTS
const nameInput = document.getElementById('nome');
const sobrenomeInput = document.getElementById('sobrenome');
const profissaoInput = document.getElementById('profissao');
const emailInput = document.getElementById('email');

const getUsers = async () => {
  // responsvel por chamadas a API (js)
  // const chamada =  fetch('http://localhost:3000/users').then(
  //   (response) => {
  //     const dado = response.json()
  //     return response.json();
  //   }
  // ).then((result) => {
  //   console.log(result);
  // }).catch((err) => {
  //   console.error(err)
  // })
  const response = await fetch(url);
  const result = await response.json();

  console.log(result); // array de usuarios 
  console.log(lista);

  result.forEach((usuario) => {
    console.log(usuario);
    lista.insertAdjacentHTML('beforeend', `
      <div class="users-card">
        <h2>${usuario.first_name} ${usuario.last_name}</h2>
        <h3>${usuario.job_title}</h3>
        <h4>${usuario.email}</h4>
        <div class="btn-group">
          <button class="btn-delete" onclick="deleteUser(${usuario.id})">Excluir</button>
          <button class="btn-edit" onclick="editUser(${usuario.id})">Editar</button>
        </div>
      </div>
    `)
  })
}

const submitForm = async (evento) => {
  evento.preventDefault();

  const firstName = evento.target.nome.value;
  const lastName = evento.target.sobrenome.value;
  const jobTitle = evento.target.profissao.value;
  const email = evento.target.email.value;

  const user = {
    first_name: firstName,
    last_name: lastName,
    job_title: jobTitle,
    email: email,
  }
  console.log(user);

  
  if(editMode) {
    const request = new Request(`${url}/${idEdit}`, {
      method: 'PUT',
      body: JSON.stringify(user),
      headers: new Headers({
        'Content-Type': 'application/json',
      })
    })
    editMode = false;
    idEdit = 0;
    const response = await fetch(request);
    const result = await response.json();
    console.log(result);
    limpaCampos();
  }else {
    const request = new Request(url, {
      method: 'POST',
      body: JSON.stringify(user),
      headers: new Headers({
        'Content-Type': 'application/json',
      })
    })
    const response = await fetch(request);
    const result = await response.json();
    console.log(result);
    limpaCampos();
  }
  
  // POST
  limpaLista();
  getUsers();
}


const deleteUser = async (id) => {
  const request = new Request(`${url}/${id}`, {
    method: 'DELETE'
  })

  const response = await fetch(request);
  const result = await response.json();
  limpaLista();
  getUsers();
}

const limpaLista = () => {
  lista.innerHTML = '';
}

const editUser = async (id) => {
  editMode = true;
  idEdit = id;
  const user = await getUserById(id);

  // busquei os inputs no DOM (arvore de elementos html)
  // alterei o value dos inputs com o valor que veio da chamada getById.
  nameInput.value = user.first_name;
  sobrenomeInput.value = user.last_name;
  profissaoInput.value = user.job_title;
  emailInput.value = user.email;
}

const getUserById = async (id) => {
  const response = await fetch(`${url}/${id}`);
  const result = await response.json();
  return result;
}


const limpaCampos = () => {
  nameInput.value = '';
  sobrenomeInput.value = '';
  profissaoInput.value = '';
  emailInput.value = '';
}

getUsers();