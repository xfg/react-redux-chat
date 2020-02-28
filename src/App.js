import React, { Component } from 'react';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import { fromEvent, merge } from 'rxjs';
import { share, filter } from 'rxjs/operators';
import { getUsers, sendMessage } from './actions';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.socket = io.connect("http://localhost:7070");
  }
  componentDidMount() {
    this.props.getUsers(this.socket);

    const getUsers = fromEvent(this.socket, 'reconnect')
      .subscribe(() => this.props.getUsers(this.socket));

    const users$ = fromEvent(this.socket, 'users').pipe(share());

    const addUser = users$
      .pipe(filter(user => user.status))
      .subscribe(this.props.onConnectUser);

    const removeUser = users$
      .pipe(filter(user => !user.status))
      .subscribe(this.props.onDisconnectUser);

    const addMessage = fromEvent(this.socket, 'messages')
      .subscribe(message => this.props.onAddMessage(message));

    const button$ = fromEvent(this.button, 'click').pipe(share());
    const enter$ = fromEvent(this.input, 'keyup')
      .pipe(filter(event => event.key === 'Enter'));

    const sendByButton = button$
      .pipe(filter(() => this.input.value))
      .subscribe(() => sendMessage(this.socket, this.input.value));

    const sendByEnter = enter$
      .pipe(filter(() => this.input.value))
      .subscribe(() => sendMessage(this.socket, this.input.value));

    const clearInput = merge(button$, enter$).subscribe(() => this.input.value = '');

    this.subscriptions = getUsers
      .add(addUser)
      .add(removeUser)
      .add(addMessage)
      .add(sendByButton)
      .add(sendByEnter)
      .add(clearInput);
  }
  componentWillUnmount() {
    this.subscriptions.unsubscribe();
  }
  render() {
    return (
      <div className="App">
        <div className="App-content">
          <div className="App-messages">
            <ul>
              {this.props.messages.map((message, index) =>
                <li key={index}>
                  <span className="App-username">{message.username}:</span>
                  <span>{message.text}</span>
                </li>
              )}
            </ul>
          </div>
          <div className="App-users">
            <ul>
              {this.props.users.map((user, index) =>
                <li key={index}>
                  {user.name}
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className="App-footer">
          <input type="text" placeholder="Введите сообщение" autoFocus ref={input => this.input = input} />
          <button ref={button => this.button = button}>Отправить</button>
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    messages: state.messages,
    users: state.users
  }),
  dispatch => ({
    getUsers: (socket) => dispatch(getUsers(socket)),
    onAddMessage: message => dispatch({ type: 'ADD_MESSAGE', payload: message }),
    onConnectUser: user => dispatch({ type: 'ADD_USER', payload: user }),
    onDisconnectUser: user => dispatch({ type: 'REMOVE_USER', payload: user })
  })
)(App);
