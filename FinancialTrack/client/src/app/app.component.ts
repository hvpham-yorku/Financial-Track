import { Component } from '@angular/core';
import { UserService } from './services/user.service';
import { User } from './models/user.model';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TabsModule } from 'primeng/tabs';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabel } from 'primeng/floatlabel';
import { PanelModule } from 'primeng/panel';
import { CommonModule } from '@angular/common';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TableModule } from 'primeng/table';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DialogModule } from 'primeng/dialog';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { AuthComponent } from './components/auth/auth.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [
    HttpClientModule, DropdownModule, ReactiveFormsModule,
    FormsModule,
    InputTextModule, DialogModule, RadioButtonModule, ButtonModule, SplitButtonModule, TableModule,
    TabsModule,
    DatePickerModule,
    FloatLabel, PanelModule, CommonModule,
    AuthComponent,
    NgIf,
  ],
  providers: [UserService],
})
export class AppComponent {  
  username: string = '';
  password: string = '';
  monthlyDate: Date;
  weeklyDate: Date;
  flag = true;
  selectedTab = '0';
  visible: boolean = false;
  ID = 100;
  act: string | undefined;
  typeOptions = [
    { label: 'Income', value: 'income' },
    { label: 'Expense', value: 'expense' }
  ];

  transactions: any = [{
    id: 1,
    amount: 220.00,
    title: "Work",
    tag: "Work",
    type: "income",
    createdAt: "2025-03-16"
  }, {
    id: 2,
    amount: 50.00,
    title: "Tip",
    tag: "Work",
    type: "income",
    createdAt: "2025-03-16"
  }, {
    id: 3,
    amount: 56.00,
    title: "Shop",
    tag: "Grocery",
    type: "expense",
    createdAt: "2025-03-16"
  }, {
    id: 4,
    amount: 9.00,
    title: "Pet",
    tag: "Grocery",
    type: "expense",
    createdAt: "2025-03-16"
  }];

  actions = [
    {
      label: 'Add',
      icon: 'pi pi-plus',
      command: () => {
        this.act = 'Add Transaction';
        this.showDialog(this.selectedTransaction);
      }
    },
    {
      label: 'Update',
      icon: 'pi pi-pencil',
      command: () => {
        this.act = 'Update ' + this.selectedTransaction.type;
        if (this.selectedTransaction) {
          this.showDialog(this.selectedTransaction);
        } else {
          console.log("Nothing selected");
        }
      }
    },
    {
      label: 'Delete',
      icon: 'pi pi-trash',
      command: () => {
        this.act = 'Delete ' + this.selectedTransaction.type;
        if (this.selectedTransaction) {
          this.showDialog(this.selectedTransaction);
        } else {
          console.log("Nothing selected");
        }
      }
    }
  ];

  transactionForm: FormGroup = new FormGroup({
    title: new FormControl(''),
    amount: new FormControl(0),
    tag: new FormControl(''),
    type: new FormControl(''),
    createdAt: new FormControl(''),
    id: new FormControl(''),
  });
  
  selectedTransaction: any = null;
  authenticated: any;

  constructor(private userService: UserService) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayAtNoon = `${yyyy}-${mm}-${dd}T12:00:00`;

    this.monthlyDate = new Date(todayAtNoon);
    this.weeklyDate = new Date(todayAtNoon);  

  }

  private formatDate(date: Date): string {
    return date ? date.toISOString().split('T')[0] : '';
  }

  get filteredTransactions() {
    const selectedDate = this.formatDate(this.selectedTab === '0' ? this.monthlyDate : this.weeklyDate);
    return this.transactions.filter((t: { createdAt: string; }) => t.createdAt === selectedDate);
  }

  get expenses() {
    // console.log(this.filteredTransactions.filter((t: { type: string; }) => t.type === 'expense'));
    return this.filteredTransactions.filter((t: { type: string; }) => t.type === 'expense');
  }

  get incomes() {
    return this.filteredTransactions.filter((t: { type: string; }) => t.type === 'income');
  }

  get totalExpense() {
    return this.expenses.reduce((sum: any, t: { amount: any; }) => sum + t.amount, 0);
  }

  get totalIncome() {
    return this.incomes.reduce((sum: any, t: { amount: any; }) => sum + t.amount, 0);
  }
  
  showDialog(transaction:any) {
    // console.log(transaction);
    this.transactionForm.patchValue({
      title: transaction?.title || '',
      amount: transaction?.amount || null,
      tag: transaction?.tag || '',
      type: transaction?.type || '',
      createdAt: transaction?.createdAt || '',
      id: transaction?.id || this.ID++
    });
    this.visible = true;
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

  onSave() {
    this.transactionForm.get('createdAt')?.setValue(this.monthlyDate);
    this.transactionForm.get('type')?.setValue(this.transactionForm.get('type')?.value.value);
    // this.transactionForm.get('id')?.setValue();
    console.log(this.transactionForm);   
    if (this.transactionForm.valid) {

      const formData = this.transactionForm.value;

      formData.createdAt = formData.createdAt || new Date();
      formData.amount = Number(formData.amount);
      console.log(formData);
      
      // this.userService.addTransaction(formData).subscribe({
      //   next: (response: any) => {
      //     console.log('Transaction added successfully', response);
      //     this.transactionForm.reset();
      //   },
      //   error: (err: any) => {
      //     console.error('Error adding transaction', err);
      //   }
      // });
    }
    this.visible = false;
  }

}
