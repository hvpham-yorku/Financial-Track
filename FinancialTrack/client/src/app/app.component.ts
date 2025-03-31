import { Component, OnInit, PLATFORM_ID, Inject, ViewChild } from '@angular/core';
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
import { NgIf } from '@angular/common';
import { RouterOutlet, Router, ActivatedRoute } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { Popover, PopoverModule } from 'primeng/popover';
import { TableComponent } from "./components/table/table.component";

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    HttpClientModule,
    DropdownModule,
    ReactiveFormsModule,
    FormsModule,
    InputTextModule,
    DialogModule,
    MenubarModule,
    RadioButtonModule,
    ButtonModule,
    SplitButtonModule,
    TableModule,
    TabsModule,
    DatePickerModule,
    FloatLabel,
    PanelModule,
    CommonModule,
    RouterOutlet,
    NgIf,
    PopoverModule,
    TableComponent
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
    { label: 'Expense', value: 'expense' },
  ];
  labl: any;
  @ViewChild('op') op!: Popover;

  transactions: any;
  weeklyTransactions:any;
  items: MenuItem[] | undefined;

  actions = [
    {
      label: 'Add',
      icon: 'pi pi-plus',
      command: () => {
        this.act = 'Add Transaction';
        this.labl = 'Add';
        this.showAddDialog();
      },
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
          // console.log('Nothing selected');
          this.errorMsg = 'Please select a transaction.'
          this.showErrorDialog(this.errorMsg);
        }
      },
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
          this.errorMsg = 'Please select a transaction.'
          this.showErrorDialog(this.errorMsg);
        }
      },
    },
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
  errorMsg: any;
  dbTransactions: { income: any[]; expense: any[] };
  table = false;

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
    this.dbTransactions = { income: [], expense: [] };
  }

  ngOnInit() {
    // Check if user is authenticated from query params
    this.route.queryParams.subscribe((params) => {
      if (params['authenticated'] === 'true') {
        this.authenticated = true;
        this.loadUserData();
      }
    });
    this.route.queryParams.subscribe((params) => {
      if (params['table'] !== undefined) {
        this.table = params['table'] === 'true';
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

  async loadUserData() {
    // Get user profile data
    this.userService.getProfile().subscribe({
      next: (response) => {
        if (response.data) {
          // console.log('User profile loaded:', response.data);
          this.userData = response.data;
        } else if (response.error) {
          console.error('Error loading profile:', response.error);
          this.showErrorDialog('Oops! ' + response.error);
        }
      },
    });
    this.getTransactions();
    this.getTransactionsByMonth(this.monthlyDate);
  }

  toggle(event: any) {
    this.op.toggle(event);
  }

  getTransactions() {
    this.userService.getTransactions().subscribe({
      next: (response) => {
        if (response.data) {
          this.dbTransactions = response.data;
        } else if (response.error) {
          console.error('Error loading transactions:', response.error);
          this.showErrorDialog('Error loading transactions: ' + response.error);
        }
      },
    });
  }

  toggleTableVisibility() {
    this.table = !this.table;
  }

  getTransactionsBy() {
    this.toggleTableVisibility();
    this.userService.tab = this.selectedTab;
    this.userService.selectedWeeklyDate = this.weeklyDate;
    this.userService.selectedMonthlyDate = this.monthlyDate;
    this.router.navigate(['/all-transactions']);
  }

  getTransactionsByMonth(cDate: any) {
    const month = cDate.toLocaleString('default', { month: '2-digit' });   
    this.userService.getTransactionsByMonth(month).subscribe({
      next: (response) => {
        if (response.data) {
          this.transactions = response.data;
          // console.log(this.transactions);
        } else if (response.error) {
          console.error('Error loading transactions:', response.error);
        }
      },
    });
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('jwt_token');
    }
    this.authenticated = false;
    this.table = false;
    this.router.navigate(['/login']);
  }

  private formatDate(date: Date): string {
    return date ? date.toISOString().split('T')[0] : '';
  }

  get actionLabel(): string {
    return this.labl == 'Delete'
      ? 'Delete'
      : this.labl == 'Update'
        ? 'Update'
        : 'Save';
  }

  get filteredTransactions() {
    const selectedDate = this.formatDate(
      this.selectedTab === '0' ? this.monthlyDate : this.weeklyDate
    );
    return this.transactions.filter(
      (t: { createdAt: string }) => t.createdAt === selectedDate
    );
  }

  get filteredIncomes() {
    return this.transactions?.filter((t: any) => {
      if (t.type !== 'income') return false;
      const created = new Date(t.createdAt);
      return this.selectedTab === '0'
        ? this.formatDate(created) === this.formatDate(this.monthlyDate)
        : this.isSameWeek(created, this.weeklyDate);
    }) ?? [];
  }
  
  get filteredExpenses() {
    return this.transactions?.filter((t: any) => {
      if (t.type !== 'expense') return false;
      const created = new Date(t.createdAt);
      return this.selectedTab === '0'
        ? this.formatDate(created) === this.formatDate(this.monthlyDate)
        : this.isSameWeek(created, this.weeklyDate);
    }) ?? [];
  }

  get expenses() {
    return this.filteredTransactions.filter(
      (t: { type: string }) => t.type === 'expense'
    );
  }

  get incomes() {
    return this.filteredTransactions.filter(
      (t: { type: string }) => t.type === 'income'
    );
  }

  get monthlyTotalIncome(): number {
    return this.transactions?.filter((t: any) => t.type === 'income')
      .reduce((sum: number, t: any) => sum + t.amount, 0) ?? 0;
  }
  
  get monthlyTotalExpense(): number {
    return this.transactions?.filter((t: any) => t.type === 'expense')
      .reduce((sum: number, t: any) => sum + t.amount, 0) ?? 0;
  }
  
  get monthlyNetTotal(): number {
    return this.monthlyTotalIncome - this.monthlyTotalExpense;
  }

  get weeklyTotalIncome(): number {
    return this.transactions?.filter((t: any) => {
      const created = new Date(t.createdAt);
      return t.type === 'income' && this.isSameWeek(created, this.weeklyDate);
    }).reduce((sum: number, t: any) => sum + t.amount, 0) ?? 0;
  }
  
  get weeklyTotalExpense(): number {
    return this.transactions?.filter((t: any) => {
      const created = new Date(t.createdAt);
      return t.type === 'expense' && this.isSameWeek(created, this.weeklyDate);
    }).reduce((sum: number, t: any) => sum + t.amount, 0) ?? 0;
  }
  
  get weeklyNetTotal(): number {
    return this.weeklyTotalIncome - this.weeklyTotalExpense;
  }
  

  onMonthlyDateChange(date: Date) {
    if (date) {
      this.monthlyDate = date;
      this.getTransactionsByMonth(this.monthlyDate);
    }
  }

  onWeeklyDateChange(date: Date) {
    if (date) {
      this.weeklyDate = date;
      this.getTransactionsByWeek(this.weeklyDate);
    }
  }

  getTransactionsByWeek(cDate: any) {
    const month = cDate.toLocaleString('default', { month: '2-digit' });   
    this.userService.getTransactionsByWeek(month).subscribe({
      next: (response) => {
        if (response.data) {
          this.weeklyTransactions = response.data;
          // console.log(this.transactions);
        } else if (response.error) {
          console.error('Error loading transactions:', response.error);
        }
      },
    });
  }

  private isSameWeek(date1: Date, date2: Date): boolean {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
  
    const startOfWeek = (d: Date) => {
      const day = d.getDay(); // 0 (Sun) to 6 (Sat)
      const diff = d.getDate() - day;
      return new Date(d.setDate(diff));
    };
  
    const start1 = startOfWeek(new Date(d1));
    const start2 = startOfWeek(new Date(d2));
  
    return start1.toDateString() === start2.toDateString();
  }

  showErrorDialog(err: any) {
    this.visible2 = true;
    this.errorMsg = err;
  }

  showDialog(transaction: any) {
    // console.log(transaction);
    this.transactionForm.patchValue({
      title: transaction?.title || '',
      amount: transaction?.amount || null,
      tag: transaction?.tag || '',
      type: transaction?.type || '',
      createdAt: transaction?.createdAt || '',
      id: transaction.id
    });
    this.visible = true;
  }

  showAddDialog() {
    this.visible = true;
  }

  addUser() {
    const newUser = new User(this.username, this.password);
    // console.log(newUser);
    this.userService.addUser(newUser).subscribe(
      (response) => {
        // console.log('User added successfully', response);
        // this.showErrorDialog('User added successfully!');
        alert('User added successfully!');
      },
      (error) => {
        console.error('There was an error adding the user!', error);
        // this.showErrorDialog('Error adding user');
        alert('Error adding user');
      }
    );
  }

  onSave() {
    this.transactionForm.get('createdAt')?.setValue(this.monthlyDate);
    const formData = this.transactionForm.value;
    formData.createdAt = formData.createdAt || new Date();
    formData.amount = Number(formData.amount);
    // console.log(formData, this.transactionForm);
    if (this.labl == 'Add') {

      if (this.transactionForm.valid) {
        const { id, ...dataWithoutId } = formData;
        this.userService.addTransaction(dataWithoutId).subscribe({
          next: (response: any) => {
            // console.log('Transaction added successfully', response);
            // Refresh transactions
            this.getTransactions();
            this.getTransactionsByMonth(this.monthlyDate);
          },
          error: (err: any) => {
            console.error('Error adding transaction', err);
            this.showErrorDialog('Error adding transaction' + err);
          },
        });
      }

    }else if(this.labl == 'Update'){

      this.userService.updateTransaction(formData).subscribe(response => {
        // console.log('Transaction updated successfully:', response);
        this.getTransactions();
        this.getTransactionsByMonth(this.monthlyDate);
        this.selectedTransaction = null;
      }, error => {
        console.error('Error updating transaction:', error);
        this.showErrorDialog('Error updating transaction' + error);
      });

    }else{

      this.userService.deleteTransaction(formData.id).subscribe(response => {
        // console.log('Transaction deleted successfully:', response);
        this.getTransactions();
        this.getTransactionsByMonth(this.monthlyDate);
        this.selectedTransaction = null;
      }, error => {
        console.error('Error deleting transaction:', error);
        this.showErrorDialog('Error deleting transaction' + error);
      });
    }
    this.transactionForm.reset();
    this.visible = false;
  }
}
