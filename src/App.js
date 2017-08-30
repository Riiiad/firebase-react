import React, { Component } from 'react';
import firebase, { auth, provider } from './firebase';
import './App.css';

//import { SomeBtn } from './comps/SomeBtn';

export default class App extends Component {
  constructor(){
    super();
    this.state = {
      currentItem: '',
      username: '',
      desc: '',
      items: [],
      user: '',
      image: '',
      imageUrl: ''
    }
     this.handleChange = this.handleChange.bind(this);
     this.handleSubmit = this.handleSubmit.bind(this);
     this.getImageName = this.getImageName.bind(this);

     this.login = this.login.bind(this);
     this.logout = this.logout.bind(this);
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value // Computed property names ES6 <3
    });
  }
  getImageName(e){
    this.setState({
      image: e.target.files[0]
    });
  }
  handleSubmit(e) {
    e.preventDefault();

    // console.log(this.state.image);
    // Upload image
    /*const imgFile = this.state.image;
    // Get a reference to the storage service, which is used to create references in your storage bucket
    const storage = firebase.storage();
    // Create a storage reference from our storage service
    const storageRef = storage.ref('images/' + imgFile.name);
    // Upload image to firebase
    const uploadTask = storageRef.put(imgFile);

    uploadTask.on('state_changed',
      function progress(snapshot) {
        let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(percentage);
      },
      function error(err) {
        console.log(err)
      },
      function complete() {
        console.log("*****************************");
        console.log("Image is uploaded to database");
        console.log("*****************************");

      }
    );

    storageRef.getDownloadURL().then(function(url) {
      console.log(url);
        this.setState({
          imageUrl: url
        });
    });*/

    const itemsRef = firebase.database().ref('items');
    const item = {
      title: this.state.currentItem,
      description: this.state.desc,
      user: this.state.user.displayName || this.state.user.email,
      //images: this.state.imageUrl
    }
    itemsRef.push(item);

    // Now clear the input so we can add more items
    this.setState({
      currentItem : '',
      username : '',
      desc: ''
    });
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

    const itemsRef = firebase.database().ref('items');
      itemsRef.on('value', (snapshot) => {
        let items = snapshot.val();
        let newState = [];
        for (let item in items) {
          newState.push({
            id: item,
            title: items[item].title,
            user: items[item].user,
            description: items[item].description,
            //image: items[item].images
          });
        }
        this.setState({
          items: newState
        });
    });
  }

  removeItem(itemId) {
   const itemRef = firebase.database().ref(`/items/${itemId}`);
   itemRef.remove();
  }

  render() {
    return (
      <div className='app'>
        <header>
            <div className='wrapper'>
              <h1>Super awesome messenger or someting like that</h1>
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
        <div className='container'>
          <section className='add-item'>
            <div className='lead' name="username" value={this.state.user.displayName || this.state.user.email}>{this.state.user.displayName || this.state.user.email}</div>
            <hr/>
              <form onSubmit={this.handleSubmit}>
                <input type="text" name="currentItem" placeholder="What are you bringing?" onChange={this.handleChange} value={this.state.currentItem} />
                <div className="form-group">
                  <label htmlFor="exampleFormControlTextarea1">Example textarea</label>
                  <textarea className="form-control" id="exampleFormControlTextarea1" rows="10" type="text" name="desc" placeholder="What are you bringing?" onChange={this.handleChange} value={this.state.desc} />
                </div>
                
                <button>Add Item</button>
              </form>
          </section>

          <section className='display-item'>
              <div className="wrapper">
                <ul>
                  {this.state.items.map((item) => {
                    return (
                      <li key={item.id}>
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                        <p>send by: {item.user}
                          {item.user === this.state.user.displayName || item.user === this.state.user.email ?
                          <button onClick={() => this.removeItem(item.id)}>Remove Item</button> : null}
                        </p>
                        <p>{item.images}</p>
                      </li>
                    )
                  })}
                </ul>
              </div>
          </section>
        </div>
      </div>
    );
  }
}
