import {IonicApp, Page, Modal, Alert, NavController, ItemSliding} from 'ionic-angular';
import {ConferenceData} from '../../providers/conference-data';
import {UserData} from '../../providers/user-data';
import {ScheduleFilterPage} from '../schedule-filter/schedule-filter';
import {SessionDetailPage} from '../session-detail/session-detail';
import {InputModalPage} from '../input-modal/input-modal'
import {NgZone} from "angular2/core";
import {MeteorComponent} from 'angular2-meteor'
import {Lists} from '../../lists'


@Page({
  templateUrl: 'build/pages/schedule/schedule.html'
})
export class SchedulePage extends MeteorComponent {
  dayIndex = 0;
  queryText = '';
  segment = 'all';
  excludeTracks = [];
  shownSessions = [];
  groups = [];
  // public myData:Mongo.Cursor<any>;
  lists: Mongo.Cursor<any>;
  _UserEmail: string;
  constructor(
    private app: IonicApp,
    private nav: NavController,
    private confData: ConferenceData,
    private user: UserData,
    private zone: NgZone
  ) {
    super();
    // this.updateSchedule();
    // this.lists = this.confData.getTimeline();
    this.updateSchedule();
    console.log("-------------------------------------------------------");
    console.log(this.lists);
    this._UserEmail = user.UserEmail;
    console.log(this._UserEmail);

    this.zone = new NgZone({ enableLongStackTrace: false });

    this.autorun(() => {
      this.zone.run(() => {
        console.log("------------------------------------------------------");
      });
    });


    // this.autorun(() => {
    //   if (this.myData !== undefined)
    //     this.lists = this.myData.fetch();
    // });

  }

  onPageDidEnter() {
    this.app.setTitle('Schedule');
  }

  updateSchedule() {
    //sadasd
    // console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    // console.log(this.queryText);
    // this.lists = this.confData.getTimeline(this.queryText, this.segment);
    // console.log(this.lists);
    // console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++=+");
    console.log(this.segment);
    if (this.segment === 'favorites') {
      console.log("Im in")
      this.lists = Lists.find({ "owner": this.user.UserEmail });
      // console.log(this.lists.fetch());
    }
    else if (this.queryText == '')
      this.lists = Lists.find({});
    else {
      let str = '.*' + this.queryText + '.*';
      console.log(str);
      this.lists = Lists.find({ "name": { "$regex": str } });
    }
    // this.lists = this.myData.fetch();
    // console.log(this.myData.fetch());

  }

  presentFilter() {
    let modal = Modal.create(ScheduleFilterPage, this.excludeTracks);
    this.nav.present(modal);

    modal.onDismiss((data: any[]) => {
      if (data) {
        this.excludeTracks = data;
        this.updateSchedule();
      }
    });

  }

  goToSessionDetail(sessionData) {
    // go to the session detail page
    // and pass in the session data
    this.nav.push(SessionDetailPage, sessionData);
  }

  addFavorite(slidingItem: ItemSliding, sessionData) {

    if (this.user.hasFavorite(sessionData.name)) {
      // woops, they already favorited it! What shall we do!?
      // create an alert instance
      let alert = Alert.create({
        title: 'Favorite already added',
        message: 'Would you like to remove this session from your favorites?',
        buttons: [
          {
            text: 'Cancel',
            handler: () => {
              // they clicked the cancel button, do not remove the session
              // close the sliding item and hide the option buttons
              slidingItem.close();
            }
          },
          {
            text: 'Remove',
            handler: () => {
              // they want to remove this session from their favorites
              this.user.removeFavorite(sessionData.name);

              // close the sliding item and hide the option buttons
              slidingItem.close();
            }
          }
        ]
      });
      // now present the alert on top of all other content
      this.nav.present(alert);

    } else {
      // remember this session as a user favorite
      this.user.addFavorite(sessionData.name);

      // create an alert instance
      let alert = Alert.create({
        title: 'Favorite Added',
        buttons: [{
          text: 'OK',
          handler: () => {
            // close the sliding item
            slidingItem.close();
          }
        }]
      });
      // now present the alert on top of all other content
      this.nav.present(alert);
    }

  }

  openModal() {
    let modal = Modal.create(InputModalPage, { "email": this._UserEmail });
    this.nav.present(modal);
  }

}
