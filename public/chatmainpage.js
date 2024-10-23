document.addEventListener('DOMContentLoaded', (event) => {

    const token = localStorage.getItem('token');

    axios.get('http://localhost:3000/user/message',
        {
            headers: { authorization: token }
        })
        .then(res=>{
            const data=res.data.modifiedmessages

            for(let i=0;i<data.length;i++){

                showOnScreen(data[i])
            }
        })
        .catch(err=>console.log(err))
})

function showOnScreen(data){
    const div=document.getElementById('messageDiv')

    const p=document.createElement('p')
    p.textContent=`${data.user.name} --${data.message}`
    if(data.user.name=='you'){
    p.style.backgroundColor='#5B5EA6'
    p.style.color='white'
    }else{
    p.style.backgroundColor='#FF6F61'
    }
    p.style.color='white'
    div.appendChild(p)
}

document.getElementById('messageForm').addEventListener('submit',
    function (event) {
        event.preventDefault();

        const message = document.getElementById('message').value

        const token = localStorage.getItem('token')
        console.log(message, token)

        axios.post('http://localhost:3000/user/message',
            {
                chatMessage: message
            },
            {
                headers: { authorization: token }
            })
            .then(res => {
                console.log(res.data)
                showOnScreen(res.data.newMessage)
            })
            .catch(err => console.log(err))

        document.getElementById('message').value = ' ';
    }
)

document.getElementById('logoutButton').addEventListener('click', function() {
    localStorage.clear();
    window.location.href = '/public/login.html';
})