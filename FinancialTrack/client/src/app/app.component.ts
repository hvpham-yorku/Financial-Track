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
import { BudgetComponent } from './components/budget/budget.component';
import { BudgetService } from './services/budget.service';
import { AuthService } from './services/auth.service';

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
    TableComponent,
    BudgetComponent
  ],
  providers: [UserService, BudgetService],
})
export class AppComponent implements OnInit {
  // Unchanged properties
  username: string = '';
  password: string = '';
  monthlyDate: Date;
  weeklyDate: Date;
  flag = true;
  selectedTab = '0';
  visible: boolean = false;
  ID = 100;
  showBudget: boolean = false;
  budgetViewMode : 'options' | 'list' | 'form' = 'options';
  budgetButtonStyle: any = {};

  act: string | undefined;
  typeOptions = [
    { label: 'Income', value: 'income' },
    { label: 'Expense', value: 'expense' },
  ];
  labl: any;
  @ViewChild('op') op!: Popover;

  transactions: any;
  weeklyTransactions: any;
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
          this.errorMsg = 'Please select a transaction.';
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
          this.errorMsg = 'Please select a transaction.';
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
  budgets: any;
  totalBudget: any;
  remainingBalance: any;
  styleReady = false;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private budgetService: BudgetService,
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

    if (this.authService.isAuthenticated()) {
      this.authenticated = true;
      this.loadUserData();
    } else if (this.router.url.includes('dashboard')) {
      this.router.navigate(['/login']);
    }
    
    this.getColor();
  }

  getColor(){
    this.budgetService.getAllBudgets().subscribe(response => {
      if (!response.error) {
        this.budgets = response.data;
        console.log(this.budgets);
        
        this.totalBudget = this.budgets.reduce((sum: any, b: { amount: any; }) => sum + b.amount, 0);
        this.remainingBalance = this.totalBudget - this.monthlyTotalExpense;
        this.updateBudgetButtonColor();
      }
    });
  }

  updateBudgetButtonColor() {

    setTimeout(() => {
      const budgetRatio = this.totalBudget > 0 ? (this.monthlyTotalExpense / this.totalBudget) : -1;

      console.log(budgetRatio);
      
      let buttonColor = '';

      if(budgetRatio >= 0) {
        if(budgetRatio < 0.5) {
          buttonColor = '#4caf50';
        } else if(budgetRatio >= 0.5 && budgetRatio <= 0.75) {
          buttonColor = '#ffc107';
        } else if(budgetRatio > 0.75) {
          buttonColor = '#f44336';
        }

        this.budgetButtonStyle = {
          'background-color': buttonColor,
          'border-color': buttonColor,
          'color' : 'black'
        };

        
        this.styleReady = true;

        console.log(this.budgetButtonStyle);
        
      } else {
        this.budgetButtonStyle = {};
        this.styleReady = false;
      }
    }, 100)
    
  }

  // Highlight: Updated logout method to use AuthService
  logout() {
    this.authService.logout();
    this.authenticated = false;
    this.table = false;
  }

  // All other methods remain exactly the same
  loadUserData() {
    this.userService.getProfile().subscribe({
      next: (response) => {
        if (response.data) {
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

  navigateToBudget() {
    this.showBudget = true;
    this.budgetViewMode = 'options';

    this.budgetService.updateExpensesTotal(this.monthlyTotalExpense);
  }

  get getStyle(){
    console.log(this.budgetButtonStyle);
    
    return this.budgetButtonStyle;
  }

  onBudgetClose() {
    this.showBudget = false;
  }

  getTransactions() {
    this.userService.getTransactions().subscribe({
      next: (response) => {
        if (response.data) {
          this.dbTransactions = response.data;

          setTimeout(() => {
            this.budgetService.updateExpensesTotal(this.monthlyTotalExpense);
          }, 100);
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

          const expenseTotal = this.monthlyTotalExpense;
          this.budgetService.updateExpensesTotal(expenseTotal);
        } else if (response.error) {
          console.error('Error loading transactions:', response.error);
        }
      },
    });
  }

  onMonthlyDateChange(date: Date) {
    if (date) {
      this.monthlyDate = date;
      this.getTransactionsByMonth(this.monthlyDate);
      setTimeout(() => {
        this.budgetService.updateExpensesTotal(this.monthlyTotalExpense);
      }, 300);
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
      const day = d.getDay();
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

  onSave() {
    this.transactionForm.get('createdAt')?.setValue(this.monthlyDate);
    const formData = this.transactionForm.value;
    formData.createdAt = formData.createdAt || new Date();
    formData.amount = Number(formData.amount);

    if (this.labl == 'Add') {
      if (this.transactionForm.valid) {
        const { id, ...dataWithoutId } = formData;
        this.userService.addTransaction(dataWithoutId).subscribe({
          next: (response: any) => {
            this.getTransactions();
            this.getTransactionsByMonth(this.monthlyDate);

            setTimeout(() => {
              this.budgetService.updateExpensesTotal(this.monthlyTotalExpense);
            }, 300);
          },
          error: (err: any) => {
            console.error('Error adding transaction', err);
            this.showErrorDialog('Error adding transaction' + err);
          },
        });
      }
    } else if (this.labl == 'Update') {
      this.userService.updateTransaction(formData).subscribe(response => {
        this.getTransactions();
        this.getTransactionsByMonth(this.monthlyDate);
        this.selectedTransaction = null;

        setTimeout(() => {
          this.budgetService.updateExpensesTotal(this.monthlyTotalExpense);
        }, 300);
      }, error => {
        console.error('Error updating transaction:', error);
        this.showErrorDialog('Error updating transaction' + error);
      });
    } else {
      this.userService.deleteTransaction(formData.id).subscribe(response => {
        this.getTransactions();
        this.getTransactionsByMonth(this.monthlyDate);
        this.selectedTransaction = null;

        setTimeout(() => {
          this.budgetService.updateExpensesTotal(this.monthlyTotalExpense);
        }, 300);
      }, error => {
        console.error('Error deleting transaction:', error);
        this.showErrorDialog('Error deleting transaction' + error);
      });
    }
    this.transactionForm.reset();
    this.visible = false;
    window.location.reload();
  }

  // All getters remain exactly the same
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

  private formatDate(date: Date): string {
    return date ? date.toISOString().split('T')[0] : '';
  }
}