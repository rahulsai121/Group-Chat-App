document.getElementById('loginForm').addEventListener('submit',
    function (event){
        event.preventDefault();

    const email = document.getElementById('email').value
    const password = document.getElementById('password').value


    console.log(email,password)
    axios.post('http://localhost:3000/user/login', {
        email: email,
        password: password
    })
        .then(res => {
            console.log(res)
        })
        .catch(error => {

            console.log(error);
        });

    }
)