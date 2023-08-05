import "./style.css"
import { ApiService } from "./utils/api-service";

const apiService = new ApiService('localhost', 4200)

const authForm = document.querySelector('#auth-form');
const root = document.querySelector('#app');
const emailField = authForm.querySelector('#email');
const passwordField = authForm.querySelector('#password');
const submitButton = authForm.querySelector('#submit-btn');
const todosButton = document.querySelector('#todos-btn');
const logoutButton = document.querySelector('#logout-btn');
const todosTitle = document.querySelector('#todos-title');

const validatePage = (isAuth) => {
    if (isAuth) {
        submitButton.disabled = false;
        authForm.style.display = 'none';
        logoutButton.style.display = 'block';
        todosTitle.style.display = 'block';
    } else {
        todosTitle.style.display = 'none';
        logoutButton.style.display = 'none';
        authForm.style.display = 'block';
        document.getElementById('todos-wrapper')?.remove();
    }
}

window.addEventListener('load', () => {
    const isAuth = apiService.isAuth;
    validatePage(isAuth)
})

authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const credentials = {
        email: emailField.value,
        password: passwordField.value
    }
    submitButton.disabled = true;
    const { jwt } = await apiService.login(credentials);
    const isAuth = apiService.isAuth;

    if (jwt && isAuth) {
        emailField.value = ''
        passwordField.value = ''
        validatePage(true)
    } else {
        submitButton.disabled = false;
    }
})

const logout = () => {
    apiService.logout();
    validatePage(false);
}

const getTodos = async () => {
    const todos = await apiService.todos();

    if (todos.length) {
        document.getElementById('todos-wrapper')?.remove();
        renderTodos(todos)
   }
}

const renderTodos = (todos) => {
    const wrapper = document.createElement('div');
    wrapper.id = 'todos-wrapper'

    todos.forEach(todo=>{
        const br = document.createElement('br');
        const title = document.createElement('div');
        title.className = 'mui--text-headline'
        title.innerText = todo.title;
        const description = document.createElement('div');
        description.innerText = todo.description;
        wrapper.appendChild(title);
        wrapper.appendChild(description);
        wrapper.appendChild(br);
    })

    root.appendChild(wrapper)
}

logoutButton.addEventListener('click', logout);

todosButton.addEventListener('click', getTodos);