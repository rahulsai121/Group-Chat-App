document.addEventListener('DOMContentLoaded', (event) => {
    const token = localStorage.getItem('token');
    const lastMessage = JSON.parse(localStorage.getItem('message'));

    let lastMessageId = lastMessage[lastMessage.length - 1].id


    axios.get(`http://localhost:3000/user/message?lastMessageId=${lastMessageId}`, {
        headers: { authorization: token }
    })


        .then(res => {
            let data = res.data.modifiedmessages;
            let existingMessages = JSON.parse(localStorage.getItem('message')) || [];
            let allMessages = existingMessages.concat(data);
            let recentMessages = allMessages.slice(-10);

            localStorage.setItem('message', JSON.stringify(recentMessages));

            recentMessages.forEach(message => showOnScreen(message));
        })
        .catch(err => console.log(err));
});


function showOnScreen(data) {
 
    const existingpara=document.getElementById(`${data.id}para`)
    
    if(existingpara){
        return ;
    }
    
    const div = document.getElementById('messageDiv')

    const p = document.createElement('p')
    p.textContent = `${data.user.name} --${data.message}`
    if (data.user.name == 'you') {
        p.style.backgroundColor = '#5B5EA6'
        p.style.color = 'white'
    } else {
        p.style.backgroundColor = '#FF6F61'
    }
    p.style.color = 'white'
    p.id = `${data.id}para`
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
                let data = res.data.newMessage;
                console.log('type',typeof(data),[data])
                let existingMessages = JSON.parse(localStorage.getItem('message')) || [];
                let allMessages = existingMessages.concat(data);

                let recentMessages = allMessages.slice(-10);

                localStorage.setItem('message', JSON.stringify(recentMessages));
 
                recentMessages.forEach(message => showOnScreen(message));
            })
            .catch(err => console.log(err))

        document.getElementById('message').value = ' ';
    }
)

document.getElementById('logoutButton').addEventListener('click', function () {
    localStorage.clear();
    window.location.href = '/public/login.html';
})