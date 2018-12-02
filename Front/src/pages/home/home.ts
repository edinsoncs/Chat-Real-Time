import { Component, ElementRef, ViewChild, HostListener } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Socket } from 'ng-socket-io';
import { ChatPage } from '../chat/chat';



@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {

	public username;
	localData: Storage;

	@ViewChild('textInput') textInput;

	setFocus() {
	    this.textInput.nativeElement.focus();
	}

	removeFocus() {
	    this.textInput.nativeElement.blur();
	}


	constructor(
	public navCtrl: NavController, 
	private alertCtrl: AlertController,
	public storage: Storage,
	private socket: Socket) {

		this.socket.connect();

		if(localStorage.getItem('username')) {
			this.socket.emit('set-nickname', localStorage.getItem('username'));
			this.navCtrl.push(ChatPage);
		}


	}


	login() {

		let u_validate = this.username;

		if(u_validate) {

			if(u_validate.length >= 4) {
				localStorage.setItem('username', u_validate);

				let alert = this.alertCtrl.create({
			    title: 'Selecciona tu sexo',
			    buttons: [
			      {
			        text: 'Hombre',
			        role: 'Hombre',
			        handler: () => {
			          this.continuePage(1);
			        }
			      },
			      {
			        text: 'Mujer',
			        role: 'Mujer',
			        handler: () => {
			          this.continuePage(2);
			        }
			      },
			      {
			        text: 'Indistinto',
			        role: 'Indistinto',
			        handler: () => {
			          this.continuePage(3);
			        }
			      }
			    ]
			  });
			  alert.present();


			} else {

				let alert = this.alertCtrl.create({
					title: 'Error',
					subTitle: 'Escriba un usuario mayor a 4 caracteres',
					buttons: ['Cerrar']
				});
				alert.present();

			}

		} else {

			let alert = this.alertCtrl.create({
				title: 'Error',
				subTitle: 'Escriba un nombre',
				buttons: ['Cerrar']
			});
			alert.present();

		}

	}


	continuePage(type) {

		switch (type) {
			case 1:

				this.defineAvatar(type);
				localStorage.setItem('sexo', 'Hombre');

				break;

			case 2:

				this.defineAvatar(type);
				localStorage.setItem('sexo', 'Mujer');

				break;

			case 3:

				this.defineAvatar(type);
				localStorage.setItem('sexo', 'Indistinto');

				break;
			
			default:
				// code...
				break;
		}


		


	}



	defineAvatar(type) {

		const h = ['http://i63.tinypic.com/117tdzp.jpg',
				   'http://i65.tinypic.com/vsdkwp.png',
				   'http://i65.tinypic.com/289ajdi.jpg',
				   'http://i64.tinypic.com/141mxdj.jpg',
				   'http://i63.tinypic.com/20a5uol.png',
				   'http://i66.tinypic.com/sfh5pw.png',
				   'http://i67.tinypic.com/9leqzs.jpg',
				   'http://i66.tinypic.com/29ua9g.jpg',
				   'http://i66.tinypic.com/35miqzn.jpg'];

		const m = ['http://i68.tinypic.com/5fp452.jpg',
				   'http://i68.tinypic.com/5fp452.jpg',
				   'http://i63.tinypic.com/vxyyzd.jpg',
				   'http://i63.tinypic.com/35854eo.jpg',
				   'http://i64.tinypic.com/iejtwo.jpg',
				   'http://i68.tinypic.com/oa3toz.jpg',
				   'http://i63.tinypic.com/j0zm03.jpg',
				   'http://i65.tinypic.com/2lk2q1z.png',
				   'http://i63.tinypic.com/war62p.jpg']


		const i = ['http://i64.tinypic.com/aac49l.jpg',
					'http://i65.tinypic.com/28s3qyg.jpg',
					'http://i64.tinypic.com/2j1agsh.jpg',
					'http://i66.tinypic.com/140hymu.jpg',
					'http://i65.tinypic.com/343hgsn.jpg',
					'http://i67.tinypic.com/2rx9ulk.jpg',
					'http://i67.tinypic.com/9hunue.jpg',
					'http://i67.tinypic.com/9hunue.jpg']

		if(type == 1) {
			var img = h[Math.floor(Math.random() * h.length)];
			localStorage.setItem('avatar', img);
		} else if(type == 2) {
			var img = m[Math.floor(Math.random() * m.length)];
			localStorage.setItem('avatar', img);
		} else {
			var img = i[Math.floor(Math.random() * i.length)];
			localStorage.setItem('avatar', img);
		}

		this.socket.emit('set-nickname', localStorage.getItem('username'));
		this.navCtrl.push(ChatPage);

	}


}
