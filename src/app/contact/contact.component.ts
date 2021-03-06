import { Component, OnInit, NgModuleFactoryLoader } from '@angular/core';
import { Contact } from './contact.model';
import { Http } from '@angular/http';
import { LocalStorageService } from '../localStorageService';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ToastService } from '../toast/toast.service';

export interface Icontact {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  owed: number;
  phone: string;
}

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  contacts: Array<Icontact> = [];
  params: string;
  constructor(
    private http: Http,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
  ) {
  }

  async ngOnInit() {
    this.contacts = await this.loadContacts();
  }

  async loadContacts() {
    let contacts = JSON.parse(localStorage.getItem('contacts'));
    if (contacts && contacts.length > 0) {
      // this.contacts = contacts;
    } else {
      contacts = await this.loadContactsFromJson();
    }
    console.log('this.contacts from ngOninit...', this.contacts);
    this.contacts = contacts;
    return contacts;
  }

  async loadContactsFromJson() {
    const contacts = await this.http.get('assets/contacts.json').toPromise();
    return contacts.json();
  }

  addContact() {
    const contact: Icontact = {
      id: null,
      firstName: null,
      lastName: null,
      email: null,
      owed: null,
      phone: null
    };
    this.contacts.unshift(contact);
    this.saveToLocalStorage();
  }
  deleteContact(index: number) {
    this.contacts.splice(index, 1);
    this.saveToLocalStorage();
  }
  saveToLocalStorage() {
    localStorage.setItem('contacts', JSON.stringify(this.contacts));
  }
  finalize() {
    this.calculate();
    const data = this.calculate();
    // this is code to do route to home page
    this.router.navigate(['home', data]);
  }
  calculate() {
    let owed = 0;
    for (let i = 0; i < this.contacts.length; i++) {
      // console.log('i--->', i, "this.contacts[i]", this.contacts[i]);
      owed += this.contacts[i].owed;
      // console.log('owed---->', owed);
    }
    // the math to calculate the total with tax
    return {
      numberOfContacts: this.contacts.length,
      subTotal: owed,
      taxAmount: owed * .10,
      total: owed + (owed * .10)
    };
  }
  search(params: string) {
    console.log('from serch.... params', params);

    this.contacts = this.contacts.filter((contact: Icontact) => {
      return contact.firstName.toLocaleLowerCase() === params.toLocaleLowerCase();
    });
  }
}
