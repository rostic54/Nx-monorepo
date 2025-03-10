import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    Signal,
    ViewContainerRef
} from '@angular/core';
import {WeekDays} from "@angular-monorepo/enums-calendar";
import {WeekSeparatorPipe} from "@angular-monorepo/pipes-calendar";
import {NgClass, NgForOf, NgIf, NgStyle} from "@angular/common";
import {Day, ScheduledEvent} from "@angular-monorepo/models-calendar";
import {
    CdkDrag,
    CdkDragDrop,
    CdkDropList,
    DragDropModule,
    moveItemInArray,
    transferArrayItem
} from "@angular/cdk/drag-drop";
import {EventBriefInfoComponent} from "@angular-monorepo/ui";
import {DateManagerService, NotificationService} from "@angular-monorepo/services-calendar";
import {Router, ActivatedRoute} from "@angular/router";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {
    ImportantDateDetailsDialogComponent
} from "@angular-monorepo/ui";
import {MatDialog} from "@angular/material/dialog";
import {ImportantDate} from "../../calendar/store/important-date/important-date.model";
import {MatIcon} from "@angular/material/icon";

@Component({
    selector: 'lib-week',
    standalone: true,
    imports: [
        NgForOf,
        NgIf,
        NgClass,
        WeekSeparatorPipe,
        EventBriefInfoComponent,
        DragDropModule,
        CdkDrag,
        CdkDropList,
        NgStyle,
        FormsModule,
        MatFormField,
        MatInput,
        MatLabel,
        ReactiveFormsModule,
        MatButton,
        MatIcon,
    ],
    templateUrl: './week.component.html',
    styleUrl: './week.component.scss'
})
export class WeekComponent implements OnInit {

    @Input() days: Day[] = [];
    @Output() gotChanged: EventEmitter<Day[]> = new EventEmitter<Day[]>();

    isSelectionModeActive!: Signal<boolean>;
    storedDayForm!: FormGroup;
    private toValue!: Day | null;
    private fromValue!: Day | null;

    readonly week = [
        WeekDays.Monday,
        WeekDays.Tuesday,
        WeekDays.Wednesday,
        WeekDays.Thursday,
        WeekDays.Friday,
        WeekDays.Saturday,
        WeekDays.Sunday
    ];

    constructor(private dateManagerService: DateManagerService,
                private router: Router,
                private route: ActivatedRoute,
                private notificationService: NotificationService,
                private viewContainerRef: ViewContainerRef,
                private dialog: MatDialog) {
    }

    ngOnInit() {
        this.initForm();
        this.isSelectionModeActive = this.dateManagerService.isSelectionModeActive;
    }

    drop(event: CdkDragDrop<ScheduledEvent[]>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex,
            );
            this.notificationService.openSnackBar('The appointment was postponed successfully.')
            this.emitChangedDayValue([this.fromValue!, this.toValue!]);
            this.clearFormAndDnD();
        }
    }

    entered(cell: Day) {
        this.toValue = cell;
    }

    exited(cell: Day) {
        this.fromValue = cell;
    }

    dayClickHandler(row: number, col: number): void {
        this.dateManagerService.setSelectedDay(this.pickCorrectDayFromMonthScreen(row, col));
        if (!this.isSelectionModeActive()) {
            this.openDayDetails();
        } else {
            this.openImportantDayForm(row, col);
        }
    }

    openDayDetails() {
        this.router.navigate(['calendar/day']);
    }

    clearFormAndDnD() {
        this.toValue = null;
        this.fromValue = null;
    }

    initForm(): void {
        this.storedDayForm = new FormGroup({
            title: new FormControl('', [Validators.maxLength(25), Validators.minLength(3), Validators.required])
        })
    }

    openImportantDayForm(row: number, col: number) {
        this.dialog.open(ImportantDateDetailsDialogComponent, {
            data: {
                formGroup: this.storedDayForm
            },
        }).afterClosed()
            .subscribe(() => {
                    if (this.storedDayForm.valid) {
                        const selectedDate = this.dateManagerService.getDetailsForImportantDate()
                        const importantDateId = selectedDate.getTime();
                        const payload: ImportantDate = new ImportantDate(importantDateId, selectedDate, this.storedDayForm.value);
                    }
                }
            )
    }

    private emitChangedDayValue(days: Day[]): void {
        this.gotChanged.emit(days);
    }

    private pickCorrectDayFromMonthScreen(x: number, y: number): number {
        return (x * 7) + y
    }
}
