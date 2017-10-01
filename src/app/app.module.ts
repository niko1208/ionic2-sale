
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { SplashPage } from './../pages/splash/splash';
import { LatestSubPage } from './../pages/latest-sub/latest-sub';
import { PostwantedthingPage } from './../pages/postwantedthing/postwantedthing';
import { DetailSubPage } from './../pages/detail-sub/detail-sub';
import { ServerDataModel } from './model/ServerDataModel-helper';
import { Service } from './../providers/service';
//  import { JsonData } from './../providers/json-data';
import { PostPage } from './../pages/post/post';
import { LatestPage } from './../pages/latest/latest';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { MorePage} from '../pages/more/more';
import { DetailPage} from '../pages/detail/detail';
import { DetailPage1} from '../pages/detail1/detail1';
import { WantedPage} from '../pages/wanted/wanted';
import { RegisterPage} from '../pages/register/register';
import { ProfilePage} from '../pages/profile/profile';
import { MyprofilePage} from '../pages/myprofile/myprofile';
import { MyprofileinfoPage} from '../pages/myprofileinfo/myprofileinfo';
import { MyadsPage} from '../pages/myads/myads';
import { MychatPage} from '../pages/mychat/mychat';
import { ChatPage} from '../pages/chat/chat';
import { WantedPage1} from '../pages/wanted1/wanted1';
import { ReviewPage } from '../pages/review/review';
import { FollowPage } from '../pages/follow/follow';
import { TabsPage } from '../pages/tabs/tabs';
import { FViewPage } from '../pages/fview/fview';
import { RegionPage } from '../pages/region/region';
import { BidPage } from '../pages/bid/bid';
import { TopsellerPage } from '../pages/topseller/topseller';
import { SearchPage } from '../pages/search/search';
import { LoginPage } from '../pages/login/login';
import { WantedthingPage } from '../pages/wantedpage/wantedpage';
import { FavoritePage } from '../pages/favorite/favorite';
import { MynotificationPage } from '../pages/notification/notification';
import { MembershipPage } from '../pages/membership/membership';
import { AddonsPage } from '../pages/addons/addons';
import { Data } from '../providers/data';
import { Push } from '@ionic-native/push';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TranslateModule } from 'ng2-translate/ng2-translate';
import { TranslateLoader, TranslateStaticLoader } from 'ng2-translate/src/translate.service';
import { Http, HttpModule } from '@angular/http';

import 'rxjs/Rx';

export function createTranslateLoader(http: Http) {
	return new TranslateStaticLoader(http, './assets/i18n', '.json');
}

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    MorePage,
    DetailPage,
    DetailPage1,
    LatestPage,
    WantedPage,
    PostPage,
    DetailSubPage,
    PostwantedthingPage,
    LatestSubPage,
    SplashPage,
    TabsPage,
    FViewPage,
    LoginPage,
    RegionPage,
    WantedPage1,
    WantedthingPage,
    FavoritePage,
    RegisterPage,
    ProfilePage,
    MyadsPage,
    MychatPage,
    ChatPage,
    MyprofilePage,
    MynotificationPage,
    ReviewPage,
    FollowPage,
    BidPage,
    TopsellerPage,
    SearchPage,
    MembershipPage,
    AddonsPage,
    MyprofileinfoPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    HttpModule,
    TranslateModule.forRoot({
			provide: TranslateLoader,
      useFactory: (createTranslateLoader),
			deps: [Http]
		}),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    MorePage,
    DetailPage,
    DetailPage1,
    LatestPage,
    WantedPage,
    PostPage,
    DetailSubPage,
    PostwantedthingPage,
    LatestSubPage,
    SplashPage,
    TabsPage,
    FViewPage,
    LoginPage,
    RegionPage,
    WantedPage1,
    WantedthingPage,
    FavoritePage,
    RegisterPage,
    ProfilePage,
    MyadsPage,
    MychatPage,
    ChatPage,
    MyprofilePage,
    MynotificationPage,
    ReviewPage,
    FollowPage,
    BidPage,
    TopsellerPage,
    SearchPage,
    MembershipPage,
    AddonsPage,
    MyprofileinfoPage
  ],
  providers: [Push, Service, {provide: ErrorHandler, useClass: IonicErrorHandler}],
})
export class AppModule {}
