import React, { Component } from 'react';
import firebase, { auth, provider } from '../firebase';

export default class InputForm extends Component {
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
    const itemsRef = firebase.database().ref('items');
    const item = {
      title: this.state.currentItem,
      description: this.state.desc,
      user: this.state.user.displayName || this.state.user.email
    }
    itemsRef.push(item);
    // Now clear the input so we can add more items
    this.setState({
      currentItem : '',
      username : '',
      desc: ''
    });
    console.log(this.state.image);
    // Upload image
    const imgFile = this.state.image;
    // Get a reference to the storage service, which is used to create references in your storage bucket
    const storage = firebase.storage();
    // Create a storage reference from our storage service
    const storageRef = storage.ref('images/' + imgFile.name);
    // Upload image to firebase
    let uploadTask = storageRef.put(imgFile);

    uploadTask.on('state_changed',
      function progress(snapshot) {
        let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(percentage);
      },
      function error(err) {
        console.log(err)
      },
      function complete(snapshot) {
        console.log("*****************************");
        console.log("Image is uploaded to database");
        console.log("*****************************");
      }
    );
    this.setState({
      imageUrl: storage.ref('images/' + imgFile)
    })

  }

  render() {
    return(

      <form onSubmit={this.handleSubmit}>

        <input type="text" name="currentItem" placeholder="What are you bringing?" onChange={this.handleChange} value={this.state.currentItem} />
        <div className="form-group">
          <label htmlFor="exampleFormControlTextarea1">Example textarea</label>
          <textarea className="form-control" id="exampleFormControlTextarea1" rows="10" type="text" name="desc" placeholder="What are you bringing?" onChange={this.handleChange} value={this.state.desc} />
        </div>
        <div className="form-group">
          <label htmlFor="exampleFormControlFile1">Example file input</label>
          <input type="file" className="form-control-file" id="exampleFormControlFile1" name="image" onChange={this.getImageName} />
        </div>
        <button>Add Item</button>
      </form>

   );
  }
}
