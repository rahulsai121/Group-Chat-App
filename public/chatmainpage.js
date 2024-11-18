

const socket = io('http://localhost:3000');

socket.on('group message',(data)=>{
    let message=data

    let existingMessages = JSON.parse(localStorage.getItem('message')) || [];
    let allMessages = existingMessages.concat(message);

    let recentMessages = allMessages.slice(-10);

    localStorage.setItem('message', JSON.stringify(recentMessages));

    getMessage()
})

document.addEventListener('DOMContentLoaded', async (event) => {
    const token = localStorage.getItem('token');

    localStorage.removeItem('group');
    localStorage.removeItem('message');
    localStorage.removeItem('currentGroup')

    if (!token) {
        window.location.href = '/public/login.html';  // Redirect to login page if not logged in
        return;
    }


    axios.get(`http://localhost:3000/group/allGroup`, {
        headers: { authorization: token }
    })
        .then(res => {
            const arrs = res.data
            const div = document.getElementById('allGroupDiv')
            arrs.forEach((arr) => {

                const newDiv = document.createElement('div')
                newDiv.textContent = arr.name
                newDiv.style.cursor = 'pointer'
                newDiv.style.padding = '20px'
                div.appendChild(newDiv)
                newDiv.addEventListener('click', () => { getGroupMessage(arr.id, arr.name); allMessages(arr.name) });
            })
        })

        .catch(err => console.log(err))


    const createGroupForm = document.getElementById('groupForm')

    const addUserForm = document.getElementById('addUserForm')

    const promoteUserTOAdmin = document.getElementById('promoteUserForm')

    const removeUser = document.getElementById('removeUserForm')

    const createMessage = document.getElementById('messageForm')

    const logout = document.getElementById('logoutButton')



    createGroupForm.addEventListener('submit',
        async (event) => {
            event.preventDefault();
            const groupName = document.getElementById('createGroup').value;

            try {
                const res = await axios.post('http://localhost:3000/group/createGroup', { groupName }, {
                    headers: { authorization: token }
                });
                console.log('res----', res.data)

                const arr = res.data
                const div = document.getElementById('allGroupDiv')

                const newDiv = document.createElement('div')
                newDiv.textContent = groupName
                newDiv.style.cursor = 'pointer'
                newDiv.style.padding = '20px'
                div.appendChild(newDiv)
                newDiv.addEventListener('click', () => getGroupMessage(arr, groupName))
                document.getElementById('createGroup').value = '';
                alert('Group created');
            }
            catch (err) {
                console.log(err);
            }
        });

    addUserForm.addEventListener('submit',
        async (event) => {
            event.preventDefault();

            const email = document.getElementById('emailToAddUser').value
            const group = document.getElementById('groupNameToAddUser').value


            axios.post(`http://localhost:3000/group/addUser`, { email, group }, {
                headers: { authorization: token }
            })
                .then(res => alert(res.data.message))
                .catch(err => {
                    console.log(err)

                    alert(err.response.data.message)
                })
        }
    )

    promoteUserTOAdmin.addEventListener('submit',
        async (event) => {
            event.preventDefault();

            const email = document.getElementById('promoteUserTOAdmin').value
            const group = document.getElementById('GroupNameToPromoteUser').value



            axios.put(`http://localhost:3000/group/promoteUser`, { email, group }, {
                headers: { authorization: token }
            })
                .then(res => alert(res.data.message))
                .catch(err => {
                    console.log(err)

                    alert(err.response.data.message)
                })

        }
    )

    removeUser.addEventListener('submit',
        async (event) => {
            event.preventDefault();

            const email = document.getElementById('removeUser').value
            const group = document.getElementById('removeUserInGroup').value


            axios.delete(`http://localhost:3000/group/removeUser`, { data: { email, group }, headers: { 'authorization': token } })
                .then(res => alert(res.data.message))
                .catch(err => {
                    console.log(err)

                    alert(err.response.data.message)
                })
        }
    )


    createMessage.addEventListener('submit',
        function (event) {
            event.preventDefault();

            const group = localStorage.getItem('group')

            if (!group) {
                alert('Select group')
                return
            }

            const message = document.getElementById('message').value


            axios.post('http://localhost:3000/message/createMessage',
                {
                    message: message,
                    groupName: group
                },
                {
                    headers: { authorization: token }
                })
                .then(res => {


                    const currentGroup=localStorage.getItem('currentGroup')
                    let data = res.data.newMessage;
                    socket.emit('group message',({data,currentGroup}))

                    let existingMessages = JSON.parse(localStorage.getItem('message')) || [];
                    let allMessages = existingMessages.concat(data);

                    let recentMessages = allMessages.slice(-10);

                    localStorage.setItem('message', JSON.stringify(recentMessages));

                    getMessage()
                })
                .catch(err => console.log(err))

            document.getElementById('message').value = ' ';
        }
    )


    logout.addEventListener('click',
        () => {
            localStorage.clear();
            window.location.href = '/public/login.html';
        })

});
function allMessages(data) {
    const token = localStorage.getItem('token')
    axios.get('http://localhost:3000/message/allMessage',
        {
            headers: { authorization: token },
            params: { groupName: data }
        })
        .then(res => {
            let data = res.data;
            data.reverse()

            localStorage.setItem('message', JSON.stringify(data));

            getMessage()
        })
        .catch(error=>console.log(error))
}

function getGroupMessage(data1, data2) {

    let currentGroup=localStorage.getItem('currentGroup')
    if(currentGroup){
        localStorage.removeItem('currentGroup')
        socket.emit('leave group',currentGroup)
    }

    localStorage.setItem('group', data2)

    localStorage.setItem('currentGroup',data2)
    socket.emit('join group',(data2))

    const div = document.getElementById('messageContainer')
    div.innerHTML = ''
    const newHeading = document.createElement('h2')
    newHeading.innerText = `Your in this Group -- ${data2}`

    div.appendChild(newHeading)
}

function getMessage() {

    const messages = JSON.parse(localStorage.getItem('message'));

    let paragraphs = document.getElementsByTagName('p');
    Array.from(paragraphs).forEach(function (paragraph) {
        paragraph.remove();
    });

    messages.forEach(message => showOnScreen(message));
}

function showOnScreen(data) {

    const existingpara = document.getElementById(`${data.id}para`)

    if (existingpara) {
        return;
    }

    const div = document.getElementById('messageContainer')


    const p = document.createElement('p')
    p.textContent = `${data.user.name} --${data.message}`

    
    p.id = `${data.id}para`
    div.appendChild(p)
}



