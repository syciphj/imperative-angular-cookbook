import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent {
  @Input() title: string = 'Confirmation Required'
  @Input() message: string = 'Are you sure you want to delete this recipe?'
  @Input() cancelMsg: string = 'Cancel'
  @Input() confirmMsg: string = 'Delete'
  @Output() close = new EventEmitter<void>()
  @Output() confirm = new EventEmitter<void>()

  onConfirm() {
    this.confirm.emit()
  }

  onClose() {
    this.close.emit()
  }
}
