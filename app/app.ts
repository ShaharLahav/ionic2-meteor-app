import {ViewChild} from 'angular2/core';
import {App, Events, Platform, Nav} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {ConferenceData} from './providers/conference-data';
import {UserData} from './providers/user-data';
import {TabsPage} from './pages/tabs/tabs';
import {LoginPage} from './pages/login/login';
import {SignupPage} from './pages/signup/signup';
import {TutorialPage} from './pages/tutorial/tutorial';
import {MeteorComponent} from 'angular2-meteor';
import {Lists} from './lists'


interface PageObj {
    title: string;
    component: any;
    icon: string;
    index?: number;
}

@App({
    templateUrl: 'build/app.html',
    providers: [ConferenceData, UserData],
    config: {}
})
class ConferenceApp extends MeteorComponent {//
    // the root nav is a child of the root app component
    // @ViewChild(Nav) gets a reference to the app's root nav
    @ViewChild(Nav) nav: Nav;
    public myData: Mongo.Cursor<any>;
    // List of pages that can be navigated to from the left menu
    // the left menu only works after login
    // the login page disables the left menu
    appPages: PageObj[] = [
        { title: 'Schedule', component: TabsPage, icon: 'calendar' },
        { title: 'Speakers', component: TabsPage, index: 1, icon: 'contacts' },
        { title: 'Map', component: TabsPage, index: 2, icon: 'map' },
        { title: 'About', component: TabsPage, index: 3, icon: 'information-circle' },
    ];
    loggedInPages: PageObj[] = [
        { title: 'Logout', component: TabsPage, icon: 'log-out' }
    ];
    loggedOutPages: PageObj[] = [
        { title: 'Login', component: LoginPage, icon: 'log-in' },
        { title: 'Signup', component: SignupPage, icon: 'person-add' }
    ];
    rootPage: any;
    loggedIn = false;

    constructor(
        private events: Events,
        private userData: UserData,
        platform: Platform,
        confData: ConferenceData
    ) {
        super();
        // Call any initial plugins when ready
        platform.ready().then(() => {
            StatusBar.styleDefault();
            this.myData = Lists.find({});
            console.info(this.myData);



        });

        // load the conference data
        confData.load();

        // decide which menu items should be hidden by current login status stored in local storage
        this.userData.hasLoggedIn().then((hasLoggedIn) => {
            this.loggedIn = (hasLoggedIn == 'true');
            if (this.loggedIn)
                this.rootPage = TabsPage;
            else {
                this.rootPage = TutorialPage;
            }
        });



        this.listenToLoginEvents();
    }

    openPage(page: PageObj) {
        // the nav component was found using @ViewChild(Nav)
        // reset the nav to remove previous pages and only have this page
        // we wouldn't want the back button to show in this scenario
        if (page.index) {
            this.nav.setRoot(page.component, { tabIndex: page.index });

        } else {
            this.nav.setRoot(page.component);
        }

        if (page.title === 'Logout') {
            // Give the menu time to close before changing to logged out
            this.nav.setRoot(LoginPage);
            setTimeout(() => {
                this.userData.logout();
            }, 1000);
        }
    }

    listenToLoginEvents() {
        this.events.subscribe('user:login', () => {
            this.loggedIn = true;
        });

        this.events.subscribe('user:signup', () => {
            this.loggedIn = true;
        });

        this.events.subscribe('user:logout', () => {
            this.loggedIn = false;
        });
    }
}
