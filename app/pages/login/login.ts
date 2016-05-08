import {Page, NavController, Alert} from 'ionic-angular';
import {TabsPage} from '../tabs/tabs';
import {SignupPage} from '../signup/signup';
import {UserData} from '../../providers/user-data';
import {MeteorComponent} from 'angular2-meteor';
import {Userss} from '../signup/userss'


@Page({
    templateUrl: 'build/pages/login/login.html'
})
export class LoginPage extends MeteorComponent {
    login: { email?: string, password?: string } = {};
    submitted = false;
    usersArray: any;

    constructor(private nav: NavController, private userData: UserData) { super(); }

    onLogin(form) {
        this.submitted = true;

        if (form.valid) {
            this.usersArray = Userss.find({ "email": this.login.email, "password": this.login.password }).fetch();
            if (this.usersArray.length > 0) {
                this.userData.login(this.login.email);
                this.nav.push(TabsPage);
            }
            else {

                let alert = Alert.create({
                    title: 'Wrong email or Password',
                    subTitle: 'You entered a wrong Email and Password combination,Please try again!',
                    buttons: ['OK']
                });
                this.nav.present(alert);
            }
        }
    }

    onSignup() {
        this.nav.push(SignupPage);
    }
}
