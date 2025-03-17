import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
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
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TableModule } from 'primeng/table';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DialogModule } from 'primeng/dialog';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { AuthComponent } from './components/auth/auth.component';
import { NgIf } from '@angular/common';
import { RouterOutlet, Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    HttpClientModule, DropdownModule, ReactiveFormsModule,
    FormsModule,
    InputTextModule, DialogModule, RadioButtonModule, ButtonModule, SplitButtonModule, TableModule,
    TabsModule,
    DatePickerModule,
    FloatLabel, PanelModule, CommonModule,
    AuthComponent, RouterOutlet,
    NgIf,
  ],
  providers: [UserService],
})
export class AppComponent implements OnInit {
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
  labl: any;

  transactions: any = [{
    id: 1,
    amount: 220.00,
    title: "Work",
    tag: "Work",
    type: "income",
    createdAt: "2025-03-17"
  }, {
    id: 2,
    amount: 50.00,
    title: "Tip",
    tag: "Work",
    type: "income",
    createdAt: "2025-03-17"
  }, {
    id: 3,
    amount: 56.00,
    title: "Shop",
    tag: "Grocery",
    type: "expense",
    createdAt: "2025-03-17"
  }, {
    id: 4,
    amount: 34.00,
    title: "Pet",
    tag: "Grocery",
    type: "expense",
    createdAt: "2025-03-17"
  }];

  actions = [
    {
      label: 'Add',
      icon: 'pi pi-plus',
      command: () => {
        this.act = 'Add Transaction';
        this.labl = 'Add';
        this.showAddDialog();
      }
    },
    {
      label: 'Update',
      icon: 'pi pi-pencil',
      command: () => {
        this.act = 'Update ' + this.selectedTransaction?.type;
        this.labl = 'Update';
        if (this.selectedTransaction) {
          this.showDialog(this.selectedTransaction);
        } else {
          console.log("Nothing selected");
          this.showErrorDialog();
        }
      }
    },
    {
      label: 'Delete',
      icon: 'pi pi-trash',
      command: () => {
        this.act = 'Delete ' + this.selectedTransaction?.type;
        this.labl = 'Delete';
        if (this.selectedTransaction) {
          this.showDialog(this.selectedTransaction);
        } else {
          this.showErrorDialog();
        }
      }
    }
  ];

  transactionForm: FormGroup = new FormGroup({
    title: new FormControl(''),
    amount: new FormControl(null),
    tag: new FormControl(''),
    type: new FormControl(''),
    createdAt: new FormControl(''),
    id: new FormControl(''),
  });

  selectedTransaction: any = null;
  authenticated = false;
  visible2: boolean = false;
  userData: any;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayAtNoon = `${yyyy}-${mm}-${dd}T12:00:00`;

    this.monthlyDate = new Date(todayAtNoon);
    this.weeklyDate = new Date(todayAtNoon);

    console.log(this.userData);
  }

  ngOnInit() {
    // Check if user is authenticated from query params
    this.route.queryParams.subscribe(params => {
      if (params['authenticated'] === 'true') {
        this.authenticated = true;
        this.loadUserData();
      }
    });

    // Check if token exists in localStorage (only in browser)
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('jwt_token');
      if (token) {
        this.authenticated = true;
        this.loadUserData();
      } else {
        // If no token, ensure we're not authenticated
        this.authenticated = false;
        // Navigate to login if we're on dashboard without auth
        if (this.router.url.includes('dashboard')) {
          this.router.navigate(['/login']);
        }
      }
    }
  }

  loadUserData() {
    // Get user profile data
    this.userService.getProfile().subscribe({
      next: (response) => {
        console.log(response);
        if (response.data) {
          console.log('User profile loaded:', response.data);
          this.userData = response.data;
        } else if (response.error) {
          console.error('Error loading profile:', response.error);
        }
      }
    });
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('jwt_token');
    }
    this.authenticated = false;
    this.router.navigate(['/login']);
  }

  private formatDate(date: Date): string {
    return date ? date.toISOString().split('T')[0] : '';
  }

  get actionLabel(): string {
    return this.labl == 'Delete' ? 'Delete' : this.labl == 'Update' ? 'Update' : 'Save';
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

  showErrorDialog() {
    this.visible2 = true;
  }

  showDialog(transaction: any) {
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

  showAddDialog() {
    this.transactionForm.patchValue({
      id: this.ID++
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
    // this.transactionForm.get('type')?.value;
    // this.transactionForm.get('id')?.setValue();
    console.log(this.transactionForm);
    if (this.transactionForm.valid) {

      const formData = this.transactionForm.value;

      formData.createdAt = formData.createdAt || new Date();
      formData.amount = Number(formData.amount);
      console.log(formData);

      this.userService.addTransaction(formData).subscribe({
        next: (response: any) => {
          console.log('Transaction added successfully', response);
          // this.transactionForm.reset();
        },
        error: (err: any) => {
          console.error('Error adding transaction', err);
        }
      });
    }
    this.transactionForm.reset();
    this.visible = false;
  }

}
