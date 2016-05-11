import {Injectable} from 'angular2/core';
import {Storage, LocalStorage, Events} from 'ionic-angular';


@Injectable()
export class UserData {
  _favorites = [];
  HAS_LOGGED_IN = 'hasLoggedIn';
  storage = new Storage(LocalStorage);
  emailemail:"emailemail";
  public UserEmail:string;

  constructor(private events: Events) {
    this.storage.get(this.emailemail).then(value=>{this.UserEmail =  value;});;
  }

  hasFavorite(sessionName) {
    return (this._favorites.indexOf(sessionName) > -1);
  }

  addFavorite(sessionName) {
    this._favorites.push(sessionName);
  }

  removeFavorite(sessionName) {
    let index = this._favorites.indexOf(sessionName)
    if (index > -1) {
      this._favorites.splice(index, 1);
    }
  }

  login(email) {
    this.storage.set(this.HAS_LOGGED_IN, true);
    this.storage.set(this.emailemail,email);
    this.UserEmail = email;
    this.events.publish('user:login');
  }

  signup(email) {
    this.storage.set(this.HAS_LOGGED_IN, true);
    this.storage.set(this.emailemail,email);   
    this.UserEmail = email;
     
    this.events.publish('user:signup');
  }

  logout() {
    this.storage.remove(this.HAS_LOGGED_IN);
    this.UserEmail = '';
    
    this.events.publish('user:logout');
  }

  // return a promise
  hasLoggedIn() {
    return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
      return value;
    });
  }
  
}
