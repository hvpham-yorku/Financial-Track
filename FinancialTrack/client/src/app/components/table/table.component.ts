import { ChangeDetectorRef, Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { BadgeModule } from 'primeng/badge';
import { UserService } from '../../services/user.service';
import { DatePicker } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from "primeng/button";
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-table',
  imports: [TableModule, BadgeModule, CommonModule, InputNumberModule, DatePicker, ButtonModule, FormsModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent {

    transactions!: any;
    today = new Date();
    yyyy = this.today.getFullYear();
    mm = String(this.today.getMonth() + 1).padStart(2, '0');
    dd = String(this.today.getDate()).padStart(2, '0');
    todayAtNoon = `${this.yyyy}-${this.mm}-${this.dd}T12:00:00`;
    date = new Date(this.todayAtNoon);
    monthName:any;
    tab:any;
    week:any;


    constructor(
        private userService: UserService,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit(){
      this.tab = this.userService.tab;
      if(this.tab == "0"){
        this.date = this.userService.selectedMonthlyDate;
      }else{
        this.date = this.userService.selectedWeeklyDate;
      }
      this.getTransactionsByMon(this.date);
      this.week = this.getWeekNumber(this.date) - 1;
    }
  
    getTransactionsByMon(cDate: any) {
      const month = cDate.toLocaleString('default', { month: '2-digit' });   
      this.userService.getTransactionsByMonth(month).subscribe({
        next: (response) => {
          if (response.data) {
            this.transactions = response.data;
            if (this.tab === "1") {
              const { startOfWeek, endOfWeek } = this.getWeekRange(cDate);
    
              this.transactions = this.transactions.filter((t: any) => {
                const created = new Date(t.createdAt);
                return created >= startOfWeek && created <= endOfWeek;
              });
            }
            console.log(this.transactions);
          } else if (response.error) {
            console.error('Error loading transactions:', response.error);
          }
        },
      });
    }

    getWeekRange(date: Date): { startOfWeek: Date; endOfWeek: Date } {
      const start = new Date(date);
      start.setDate(start.getDate() - start.getDay()); // Sunday
      start.setHours(0, 0, 0, 0);
    
      const end = new Date(start);
      end.setDate(end.getDate() + 6); // Saturday
      end.setHours(23, 59, 59, 999);
    
      return { startOfWeek: start, endOfWeek: end };
    }

    getWeekNumber = (date: Date): number => {
      const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
      const dayOfYear = Math.floor(
        (date.getTime() - firstDayOfYear.getTime()) / (1000 * 60 * 60 * 24)
      );
    
      const janFirstDay = firstDayOfYear.getDay(); // 0 = Sun
      const adjustedDay = dayOfYear + janFirstDay;
    
      return Math.floor(adjustedDay / 7) + 1;
    };
    

    getBadgeSeverity(transaction: any) {
      return transaction.type === 'income' ? 'info' : 'warn';
    }
  
    rowClass(transaction: any) {
      return transaction.type === 'income' ? 'income-row' : 'expense-row';
    }
  
    rowStyle(transaction: any) {
      if (transaction.type === 'income') {
        return { backgroundColor: '#d4edda', color: '#155724' }; 
      } else {
        return { backgroundColor: '#f8d7da', color: '#721c24' };
      }
    }

    onDateSelect(event: any) {
      console.log('Selected Date:', event);
      this.mm = event.getMonth();
      this.monthName = this.getMonthName(this.mm);
      this.getTransactionsByMon(event);
    }

    getMonthName(mon: any){
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      return monthNames[Number(mon)];
    }

    dashboard(){
      this.router.navigate(['/dashboard'], { queryParams: { table: false } });
    }


}
