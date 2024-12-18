

const login = document.getElementById('loginForm').addEventListener('submit', (event) => {
        
    event.preventDefault();

    fetch('/sesion', {
        method : 'POST',
        headers : {'Content-Type' : 'application/json'},
        body : JSON.stringify({correo : document.getElementById('correo').value, password : document.getElementById('password').value})
    }) 
    .then(response => response.json())
    .then(data => {

        switch(data.status) {
            case 1 :
                location.href = '/cliente.html';
                localStorage.setItem('user', data.email);
                break;
            case 2 :
                location.href = '/inventario.html';
                break;
            default:
                console.log('ERROR');
        }
    })
    .catch(err => {
        console.log(err);
    }) 
})


