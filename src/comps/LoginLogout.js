import React, { Component } from 'react';
import firebase, { auth, provider } from '../firebase';

export default class InputForm extends Component {
  constructor(){
    super();
    this.state = {
      this.state = {

        items: [],
        user: '',

      }
       this.login = this.login.bind(this);
       this.logout = this.logout.bind(this);


  }
  logout() {
    auth.signOut()
      .then(() => {
        this.setState({
          user: ''
        });
      });
  }
  login() {
    auth.signInWithPopup(provider)
      .then((result) => {
        const user = result.user;
        this.setState({
          user
        });
      });
  }

  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user });
      }
    });
   }



  render() {
    return(
      <header>
          <div className='wrapper'>


            {this.state.user ?
              <button onClick={this.logout}>Log Out</button>
              :
              <button onClick={this.login}>Log In</button>
            }

          </div>
      </header>
      {this.state.user ?
        <div>
          <div className='user-profile'>
            <img alt="somehting" src={this.state.user.photoURL} />
          </div>
        </div>
        :
        <div className='wrapper'>
          <p>You must be logged in to see the list and submit to it.</p>
        </div>
      }


   );
  }
}
