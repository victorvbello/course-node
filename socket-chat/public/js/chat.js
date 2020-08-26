const socket = io();

const searchParams = new URLSearchParams(window.location.search);
const messageForm = document.getElementById('chat-message');
const searchUserInput = document.getElementById('search-user');
if (!searchParams.has('name') || !searchParams.get('room')) {
  window.location = 'index.html';
  throw new Error('Name or Room is required');
}

const userName = searchParams.get('name');
const room = searchParams.get('room');

if (!userName || !room) {
  window.location = 'index.html';
  throw new Error('Name or Room is required');
}

const currentUser = {
  name: userName,
  room,
};

let userList = [];

const scrollBottom = () => {
  const divChatBox = document.getElementById('divChatBox');
  const newMessage = divChatBox.lastChild;

  const clientHeight = divChatBox.clientHeight;
  const scrollTop = divChatBox.scrollTop;
  const scrollHeight = divChatBox.scrollHeight;
  const newMessageHeight = newMessage.clientHeight;
  const lastMessageHeight = newMessage.clientHeight || 0;

  if (
    clientHeight + scrollTop + newMessageHeight + lastMessageHeight >=
    scrollHeight - 30
  ) {
    divChatBox.scrollTop = scrollHeight;
  }
};

const handleClickUser = (to, socketId = '') => {
  console.log(userName, socketId);
};

const renderUser = (user = {}) => {
  const { name: userName = '', socketId = '' } = user;
  const htmlLi = document.createElement('li');
  const htmlA = document.createElement('a');
  const htmlImg = document.createElement('img');
  const htmlSpan = document.createElement('span');
  const htmlSmall = document.createElement('small');
  htmlSpan.innerHTML = htmlA.href = 'javascript:void(0)';
  htmlA.dataset['socketId'] = socketId;
  htmlImg.src = 'assets/images/users/default.jpg';
  htmlImg.alt = 'user-img';
  htmlImg.classList.add('img-circle');
  htmlSpan.innerHTML = userName;
  htmlSmall.innerHTML = 'online';
  htmlSmall.classList.add('text-success');

  htmlSpan.appendChild(htmlSmall);
  htmlA.appendChild(htmlImg);
  htmlA.appendChild(htmlSpan);
  htmlA.addEventListener('click', () => handleClickUser(userName, socketId));
  htmlLi.appendChild(htmlA);
  return htmlLi;
};

const renderUsers = (users = []) => {
  const htmlUserList = document.getElementById('user-list');
  const htmlRoomName = document.querySelectorAll('.chat-room-name');
  Array.from(htmlRoomName).forEach((item) => (item.innerHTML = room));
  Array.from(htmlUserList.children).forEach((children) => {
    const userElement = children.querySelector('a');
    if (userElement.dataset.socketId) {
      children.remove();
    }
  });
  users.forEach((user = {}) => htmlUserList.appendChild(renderUser(user)));
};

const renderMessage = (message = {}) => {
  const {
    userName: messageUser = '',
    message: text = '',
    date = 0,
    admin = false,
  } = message;
  const time = new Date(date).toLocaleTimeString('en-US');
  const divChatBox = document.getElementById('divChatBox');
  const htmlLi = document.createElement('li');
  const htmlDivImg = document.createElement('div');
  const htmlImg = document.createElement('img');
  const htmlDivContent = document.createElement('div');
  const htmlUserName = document.createElement('h5');
  const htmlMessage = document.createElement('div');
  const htmlTime = document.createElement('div');

  htmlImg.src = 'assets/images/users/default.jpg';
  htmlImg.alt = 'user';
  htmlUserName.innerHTML = messageUser;
  htmlMessage.innerHTML = text;
  htmlTime.innerHTML = time;
  htmlMessage.classList.add('box');
  htmlTime.classList.add('chat-time');
  htmlDivImg.classList.add('chat-img');
  htmlDivContent.classList.add('chat-content');
  htmlLi.classList.add('animate__animated');
  htmlLi.classList.add('animate__fadeIn');
  htmlDivImg.appendChild(htmlImg);
  htmlDivContent.appendChild(htmlUserName);
  if (userName === messageUser) {
    htmlLi.classList.add('reverse');
    htmlMessage.classList.add('bg-light-inverse');
    htmlLi.appendChild(htmlDivContent);
    htmlLi.appendChild(htmlDivImg);
  } else {
    if (!admin) {
      htmlMessage.classList.add('bg-light-info');
    } else {
      htmlMessage.classList.add('bg-light-warning');
    }
    if (!admin) htmlLi.appendChild(htmlDivImg);
    htmlLi.appendChild(htmlDivContent);
  }
  htmlDivContent.appendChild(htmlMessage);
  htmlLi.appendChild(htmlTime);
  divChatBox.appendChild(htmlLi);
};

const sendNewMessage = (to = '', message = '', callback = () => {}) => {
  socket.emit('new-message', { to, message }, callback);
};

const initSocket = () => {
  socket.on('connect', () => {
    console.log('Server connection On');
    socket.emit('user-signing', currentUser, (response) => {
      console.log('user-signing', response);
      const { users = [] } = response;
      renderUsers(users);
      userList = users;
    });
  });

  socket.on('server-info', (message = {}) => {
    console.log('server:', message);
  });

  socket.on('disconnect', () => {
    console.log('Server connection Off');
  });

  socket.on('new-message', (response) => {
    const { message = {} } = response;
    console.log('server:', response);
    renderMessage(message);
    scrollBottom();
  });

  socket.on('user-list', (response) => {
    console.log('server:', response);
    const { users = [] } = response;
    renderUsers(users);
    userList = users;
  });
};

initSocket();
messageForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const messageInput = messageForm.querySelector('input[name="message"]');
  if (!messageInput) {
    return;
  }
  const message = messageInput.value;
  if (!message) {
    return;
  }
  sendNewMessage(null, message, (result = {}) => {
    const { message: finalMessage = {} } = result;
    messageInput.value = '';
    messageInput.focus();
    renderMessage(finalMessage);
    scrollBottom();
  });
});

searchUserInput.addEventListener('keyup', (event) => {
  const { target: { value = '' } = {} } = event;
  if (!value) {
    renderUsers(userList);
    return;
  }
  const finalUsers = userList.filter((item = {}) => {
    const { name: userName = '' } = item;
    return new RegExp(value).test(userName);
  });
  renderUsers(finalUsers);
});
