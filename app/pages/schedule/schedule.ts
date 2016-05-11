import {IonicApp, Page, Modal, Alert, NavController, ItemSliding} from 'ionic-angular';
import {ConferenceData} from '../../providers/conference-data';
import {UserData} from '../../providers/user-data';
import {ScheduleFilterPage} from '../schedule-filter/schedule-filter';
import {SessionDetailPage} from '../session-detail/session-detail';


@Page({
  templateUrl: 'build/pages/schedule/schedule.html'
})
export class SchedulePage {
  dayIndex = 0;
  queryText = '';
  segment = 'all';
  excludeTracks = [];
  shownSessions = [];
  groups = [];
  lists = [];
  _UserEmail:string;
  constructor(
    private app: IonicApp,
    private nav: NavController,
    private confData: ConferenceData,
    private user: UserData
  ) {
    // this.updateSchedule();
    this.lists=this.confData.getTimeline();   
    console.log("-------------------------------------------------------");
    console.log(this.lists); 
    this._UserEmail = user.UserEmail;
    console.log(this._UserEmail);
  }

  onPageDidEnter() {
    this.app.setTitle('Schedule');
  }

  updateSchedule() {
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    console.log(this.queryText);
    this.lists=this.confData.getTimeline(this.queryText);
    console.log(this.lists);
    console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++=+");
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

}
