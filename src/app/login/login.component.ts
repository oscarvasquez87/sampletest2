import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../localStorageService';
import { Router } from '@angular/router';
import { ToastService } from '../toast/toast.service';

export interface IUser {
  id?: number;
  username: string;
  password: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user: IUser = {
    username: null,
    password: null
  };
  constructor(private router: Router, private toastService: ToastService) {
  }

  ngOnInit() {

  }

  login(user: IUser) {
    console.log('from login user: ', user);
        // set the user credentials
    const presetUser = { username: 'ovasquez', password: 'selma123' };
        // log the user in
    if (user.username != null && user.password != null &&
      user.username !== '' && user.password !== '') {
      console.log('from within if statement...');
        // acutally log them in
      if (user.username === presetUser.username &&
        user.password === presetUser.password) {
        // saving data to localStorage
        localStorage.setItem('user', JSON.stringify(user));
        // navigate to contacts page
        this.router.navigate(['contacts', user]);
      } else {
        // toast warraning if username or password was incorrect
        this.toastService.showToast('warning', 2000, 'Username or password incorrect!');
      }
    } else {
      console.log('Must specify credentials');
      // toast warraning if missing either username or password
      this.toastService.showToast('danger', 2000, 'Must specify credentials');
    }
  }

}
