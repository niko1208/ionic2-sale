import { Component } from '@angular/core';
import { HomePage } from '../home/home';
import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import {MorePage} from '../more/more';
import {LatestPage} from '../latest/latest';
import {MychatPage} from '../mychat/mychat';
import {MyprofilePage} from '../myprofile/myprofile';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab2Root: any = AboutPage;
  tab1Root: any = HomePage;
  tab3Root: any = MychatPage;
  tab4Root: any = MyprofilePage;
  tab5Root: any = LatestPage;

  constructor() {

  }
}
