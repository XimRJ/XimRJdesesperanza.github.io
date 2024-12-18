
//Expresiones regulares para la informacion
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const form = document.getElementById('signupForm').addEventListener('submit', (event) => {
    event.preventDefault();

        
    const namedata = document.getElementById('nombre').value;
    const emaildata = document.getElementById('correo').value;
    const passworddata = document.getElementById('password').value;
    


    //Verificar que los datos esten con la estructura correcta
    if(!emailRegex.test(emaildata)){
        alert("El correo electrónico no es válido. Asegúrate de usar un formato correcto como ejemplo@correo.com");
        return;
    }
    else if(!passwordRegex.test(passworddata)){
        alert(`La contraseña no es válida. Debe cumplir los siguientes requisitos:
            - Al menos 8 caracteres
            - Una letra mayúscula
            - Una letra minúscula
            - Un número
            - Un carácter especial como @$!%*?&`);
        return;
    }
    else if(emaildata.length <= 0 || passworddata.length <= 0 || namedata.length <= 0){
        alert('No se permiten campos nulos');
        return;
    }


    let JSON_INFO = {
        nombre : namedata.toLowerCase(),
        correo : emaildata.toLowerCase(),
        password : passworddata,
    }

    fetch('/registrar', {
        method : 'POST',
        headers : {'Content-Type' : 'application/json'},
        body : JSON.stringify(JSON_INFO),
    })
    .then(response => response.json())
    .then(data => {
        alert('Usuario Registrado con exito');
        window.location.href = '/iniciosesion.html';
    })
    .catch(err => { 
        alert('Error al Registrar el usuario')
        console.error(err);
    })

});
