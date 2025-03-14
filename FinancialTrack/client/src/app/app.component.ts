import { Component } from '@angular/core';
import { UserService } from './services/user.service';
import { User } from './models/user.model';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { log } from 'console';
import { ButtonModule } from 'primeng/button';
import { TabsModule } from 'primeng/tabs';
import { DatePicker, DatePickerModule } from 'primeng/datepicker';
import { FloatLabel } from 'primeng/floatlabel';
import { AuthComponent } from './components/auth/auth.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [
    HttpClientModule,
    FormsModule,
    ButtonModule,
    TabsModule,
    DatePickerModule,
    FloatLabel,
    AuthComponent,
    NgIf,
  ],
  providers: [UserService],
})
export class AppComponent {
  username: string = '';
  password: string = '';
  authenticated: boolean = false;
  ID = 0;
  monthlyDate: any;
  weeklyDate: any;

  constructor(private userService: UserService) {
    this.monthlyDate = new Date();
    this.weeklyDate = new Date();
  }

  addUser() {
    const newUser = new User(this.username, this.password, this.ID++);
    console.log(newUser);
    this.userService.addUser(newUser).subscribe(
      (response) => {
        console.log('User added successfully', response);
        alert('User added successfully!');
      },
      (error) => {
        console.error('There was an error adding the user!', error);
        alert('Error adding user');
      }
    );
  }
}
