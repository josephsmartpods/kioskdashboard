import { Injectable, NgZone } from '@angular/core';
import * as firebase from 'firebase/app';
import { User } from '../services/user';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  userData: any; // Save logged in user data

  constructor(
    public afs: AngularFirestore,   // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone // NgZone service to remove outside scope warning
  ) {
    /* Saving user data in localstorage when
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        //  JSON.parse(localStorage.getItem('user'));
      } else {
        localStorage.setItem('user', '');
        //JSON.parse(localStorage.getItem('user'));
      }
    });
  }

  // Sign in with email/password
  // SignIn(email: any, password: any) {
  //   return this.afAuth.signInWithEmailAndPassword(email, password)
  //     .then((result) => {
  //       console.log('result: ' + result);
  //       this.ngZone.run(() => {
  //         this.router.navigate(['dashboard']);
  //       });
  //       this.SetUserData(result.user);
  //     }).catch((error) => {
  //       console.log('error signin result: ' + error);
  //       if (error.message !== null) {
  //         window.alert(error.message);
  //       }
  //     });
  // }

  
  // async SignIn(email: any, password: any) {

  //     const result = await this.afAuth.signInWithEmailAndPassword(email, password);

  //     const succeeded = await this.router.navigate(['dashboard']);

  //     if (succeeded) {
  //       this.SetUserData(result.user);
  //     }
  //   }

  SignIn(email: any, password: any) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }


  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '');
    return (user !== null && user.emailVerified !== false) ? true : false;
  }

  get getUserId(): string {
    const user = JSON.parse(localStorage.getItem('user') || '');
    return (user !== null) ? user.uid : '';
  }

  // Auth logic to run auth providers
  // tslint:disable-next-line:typedef
  AuthLogin(provider: any) {
    return this.afAuth.signInWithPopup(provider)
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigate(['dashboard']);
        });
        this.SetUserData(result.user);
      }).catch((error) => {
        window.alert(error);
      });
  }

  /* Setting up user data when sign in with username/password,
  sign up with username/password and sign in with social auth
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  // tslint:disable-next-line:typedef
  SetUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    };
    return userRef.set(userData, {
      merge: true
    });
  }

  // Sign out
  // tslint:disable-next-line:typedef
  SignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['sign-in']);
    });
  }

}
