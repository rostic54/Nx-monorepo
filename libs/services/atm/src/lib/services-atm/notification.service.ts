import { Injectable } from '@angular/core';
import {MessageService} from "primeng/api";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private messageService: MessageService) { }

  errorToast(content: string) {
    this.messageService.add({severity: 'error', summary: 'Error', detail: content});
  }

  successToast(content: string) {
    this.messageService.add({severity: 'success', summary: 'Success', detail: content});
  }
}
