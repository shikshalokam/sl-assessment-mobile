import { NgModule, ErrorHandler } from '@angular/core';
import { HttpClientModule} from '@angular/common/http';
import { HttpModule } from '@angular/http';

import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { IonicStorageModule } from '@ionic/storage';
import { Network} from '@ionic-native/network';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPageModule } from '../pages/login/login.module';
import { AuthProvider } from '../providers/auth/auth';
import { CurrentUserProvider } from '../providers/current-user/current-user';
import { WelcomePage } from '../pages/welcome/welcome';
import { SchoolListPage } from '../pages/school-list/school-list';
import { SchoolListProvider } from '../providers/school-list/school-list';
import { HttpInterceptorProvider } from '../providers/http-interceptor/http-interceptor';
import { UtilsProvider } from '../providers/utils/utils';
import { ApiProvider } from '../providers/api/api';
import { SchoolProfilePageModule } from '../pages/school-profile/school-profile.module';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Geolocation } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';
import { EvidenceListPageModule } from '../pages/evidence-list/evidence-list.module';
import { SectionListPageModule } from '../pages/section-list/section-list.module';
import { QuestionerPageModule } from '../pages/questioner/questioner.module';
import { ComponentsModule } from '../components/components.module';
import { DirectivesModule } from '../directives/directives.module';
import { FaqPage } from '../pages/faq/faq';
import { SchoolProfileEditPage } from '../pages/school-profile-edit/school-profile-edit';
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { ImagePicker } from '@ionic-native/image-picker';
import { ImageListingPage } from '../pages/image-listing/image-listing';
import { MatrixActionModalPage } from '../pages/matrix-action-modal/matrix-action-modal';
import { LocationAccuracy } from '@ionic-native/location-accuracy';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    WelcomePage,
    SchoolListPage,
    FaqPage,
    SchoolProfileEditPage,
    ImageListingPage,
    MatrixActionModalPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    LoginPageModule,
    HttpModule,
    HttpClientModule,
    SchoolProfilePageModule,
    EvidenceListPageModule,
    SectionListPageModule,
    QuestionerPageModule,
    ComponentsModule,
    DirectivesModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    WelcomePage,
    SchoolListPage,
    FaqPage,
    SchoolProfileEditPage,
    ImageListingPage,
    MatrixActionModalPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    InAppBrowser,
    AuthProvider,
    CurrentUserProvider,
    Network,
    SchoolListProvider,
    HttpInterceptorProvider,
    // {provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorProvider, multi: true},
    UtilsProvider,
    ApiProvider,
    AndroidPermissions,
    Geolocation,
    Diagnostic,
    Camera,
    File,
    FilePath,
    FileTransfer,
    ImagePicker,
    LocationAccuracy
  ]
})
export class AppModule { }
