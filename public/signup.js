document.getElementById('signupForm').addEventListener('submit',
    function (event) {
        event.preventDefault();

        const name = document.getElementById('name').value
        const email = document.getElementById('email').value
        const password = document.getElementById('password').value

        console.log(name, email, password)

        /*axios.post('http://localhost:3000/user/signup', {
            name: name,
            email: email,
            password: password
        })
            .then(res => {
                window.location.href = './login.html'
            })
            .catch(err => console.log(err))*/
    }
)