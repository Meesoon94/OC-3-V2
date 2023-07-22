let loginSubmit = document.querySelector('#login-form-submit')
loginSubmit.addEventListener('click', function (e) {
    e.preventDefault();
    let emailLogin = document.getElementById('email')
    let passwordLogin = document.getElementById('password')
    if (emailLogin.value == "" && passwordLogin.value == "") {
        return alert('Mot de passe et/ou email erroné. Veuillez vérifier vos identifiants.')
    }
    let user = {
        email: emailLogin.value,
        password: passwordLogin.value
    }

    fetch("http://localhost:5678/api/users/login", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(user)
    })
        .then(reponse => reponse.json())
        .then(dataUser => {
            // Traitement de la réponse de l'API + stockage
            console.log(dataUser);
            let token = dataUser.token
            sessionStorage.setItem('token', token)
            console.log(dataUser.token)
            // Redirection vers la page d'accueil
            if (dataUser.token !== undefined ){
                window.location.href="index.html"; 
            } else {
                return alert ('Mot de passe et/ou email erroné. Veuillez vérifier vos identifiants.')
            }
        })
        .catch(error => {
            // Gestion des erreurs
            console.error(error);
        });
})

