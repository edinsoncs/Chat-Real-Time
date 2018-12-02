import { Component, ViewChild, ElementRef } from '@angular/core'
import { NavController, NavParams, Content, AlertController } from 'ionic-angular'
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';
import { AdMobFree, AdMobFreeBannerConfig, AdMobFreeInterstitialConfig } from '@ionic-native/admob-free';

@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {

  @ViewChild(Content) content: Content;
  @ViewChild('chat_input') messageInput: ElementRef;
  editorMsg = '';
  messagesAll: any = [];
  nickname = '';

  constructor(public navCtrl: NavController,
  private alertCtrl: AlertController,
  public navParams: NavParams,
  private socket: Socket,
  public admob: AdMobFree) {

    this.nickname = localStorage.getItem('username');

    this.getMessages().subscribe(message => {
        this.messagesAll.push(message);
    });

    this.ajaxList();

  }


  onFocus() {
    this.content.resize();
    this.scrollToBottom();
  }



  sendData() {

    const txt: any = document.getElementById('chat_input');

    if(txt) {

      console.log(txt);

      var txt_l = (txt) ? txt.value : null;

      if(txt_l.length > 0 && txt_l.length <= 30) {

        let list = {
          'username': localStorage.getItem('username'),
          'avatar' : localStorage.getItem('avatar'),
          'message': txt_l,
          'date': new Date()
        }

        this.socket.emit('add-message', list);
        //this.messagesAll.push(list);
        this.ajax(list);




      } else {

        let alert = this.alertCtrl.create({
          title: 'Error',
          subTitle: 'Escribe menor a 30 caracteres!',
          buttons: ['Cerrar']
        });
        alert.present();

      }

    }


  }


  getMessages() {
    let observable = new Observable(observer => {
      this.socket.on('message', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }


   scrollToBottom() {
    setTimeout(() => {
      if (this.content.scrollToBottom) {
        this.content.scrollToBottom();
      }
    }, 400)
  }


  ionViewWillLeave() {
    this.socket.disconnect();
  }

  ajax(data) {

    fetch('http://104.248.223.183:3000/', {
      method: 'POST',
      body: JSON.stringify(data),
      headers:{
        'Content-Type': 'application/json'
      }
    }).
    then(res => console.log(res));

  }


  ajaxList() {

    fetch('http://104.248.223.183:3000/list', {
      method: 'GET'
    })
    .then(response => response.json())
    .catch(error => console.error('Error:', error))
    .then((data) => {

      this.messagesAll = data;

    });

  }


  showBanner() {

        let interstitialConfig: AdMobFreeInterstitialConfig = {
            isTesting: true, // Remove in production
            autoShow: true,
            id: 'ca-app-pub-8985767471611621/2714733146'
        };

        this.admob.interstitial.config(interstitialConfig);

        this.admob.interstitial.prepare().then(() => {
            // success
        });



    }

}
