import {Page, NavController, Alert} from 'ionic-angular';
import {TabsPage} from '../tabs/tabs';
import {UserData} from '../../providers/user-data';
import {MeteorComponent} from 'angular2-meteor';
import {Userss} from './userss'


@Page({
    templateUrl: 'build/pages/signup/signup.html'
})
export class SignupPage extends MeteorComponent {
    signup: { email?: string, password?: string } = {};
    submitted = false;
    usersArray: any;

    constructor(private nav: NavController, private userData: UserData) {
        super();
    }

    onSignup(form) {
        this.submitted = true;

        // console.log(this.signup.password + "    " + this.signup.username);
        if (form.valid) {
            console.log(Userss.find().fetch());
            this.usersArray = Userss.find({ "email": this.signup.email }).fetch();
            if (this.usersArray.length > 0) {

                let alert = Alert.create({
                    title: 'Email is already in use',
                    subTitle: 'Your email is already in use in another Shahar\'s app account! try logging in insead',
                    buttons: ['OK']
                });
                this.nav.present(alert);                
            }
            else {
                let stam = Userss.insert({ "email": this.signup.email, "password": this.signup.password });
                console.log("Successfully signup " + stam);
                this.userData.signup();
                this.nav.push(TabsPage);
            }
        }
    }
}
