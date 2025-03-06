import { Component } from '@angular/core';
import { UserService } from './services/user.service';
import { User } from './models/user.model';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { log } from 'console';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [HttpClientModule, FormsModule],
  providers: [UserService],
})
export class AppComponent {
  username: string = '';
  password: string = '';
  ID = 0;
  constructor(private userService: UserService) {}

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
