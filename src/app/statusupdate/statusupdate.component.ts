import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { Clipboard } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-statusupdate',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    ClipboardModule,
  ],
  templateUrl: './statusupdate.component.html',
  styleUrl: './statusupdate.component.scss'
})
export class StatusupdateComponent implements OnInit {
  title = 'helpdesk';
  today = new Date();
  dailyUpdateForm!: FormGroup;
  inputValue: string = '';
  @ViewChild('updateText') updateText!: ElementRef<HTMLHeadingElement>;
  @ViewChild('mailContent') mailContent!: ElementRef;

  constructor(private fb: FormBuilder, private clipboard: Clipboard) {}

  ngOnInit() {
    this.initdailyUpdateForm();
  }

  initdailyUpdateForm() {
    this.dailyUpdateForm = this.fb.group({
      client: [''],
      project: [''],
      completed: this.fb.array([]),
      inprogress: this.fb.array([]),
      remaining: this.fb.array([]),
      notes: this.fb.array([]),
      queries: this.fb.array([]),
    });
    this.addFormArrayControls('completed');
    this.addFormArrayControls('inprogress');
    this.addFormArrayControls('remaining');
    this.addFormArrayControls('notes');
    this.addFormArrayControls('queries');
  }
  get completed(): FormArray {
    return this.dailyUpdateForm.get('completed') as FormArray;
  }
  get inprogress(): FormArray {
    return this.dailyUpdateForm.get('inprogress') as FormArray;
  }
  get remaining(): FormArray {
    return this.dailyUpdateForm.get('remaining') as FormArray;
  }
  get queries(): FormArray {
    return this.dailyUpdateForm.get('queries') as FormArray;
  }
  get notes(): FormArray {
    return this.dailyUpdateForm.get('notes') as FormArray;
  }
  addFormArrayControls(controlName: string) {
    const formArray = this.dailyUpdateForm.get(controlName) as FormArray;
    formArray.push(this.createFormGroup());
  }

  createFormGroup() {
    return this.fb.group({
      tasks: [''],
    });
  }

  removeSkill(controlName: string, index: number) {
    const formArray = this.dailyUpdateForm.get(controlName) as FormArray;
    formArray.removeAt(index);
  }

  onCopied() {
    this.clipboard.copy(this.updateText.nativeElement.innerText);
  }
  onCopiedMail() {
    const content = this.mailContent ? this.mailContent?.nativeElement : null;
    if (content) {
      const range = document.createRange();
      range.selectNode(content);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
      document.execCommand('copy');
      window.getSelection().removeAllRanges();
    }
  }
  convertLinks(input: string,controller: string): string {
    const linkRegex = /(https?:\/\/[^\s]+)/g;
    console.log(input);
    
    let linkedInput =  input.replace(linkRegex, '<a href="$1" target="_blank">$1</a>');
    if (controller === 'completed') {
      linkedInput += '<b *ngIf="completed.tasks.length>0">- Done</b>';
    }
    return linkedInput
  }
  isAddMoreDisabled(controller: string): boolean {
    const completedTasks = this.dailyUpdateForm.get(controller) as FormArray;
    const lastTask = completedTasks.at(completedTasks.length - 1);
    if (!lastTask) return false; // If no tasks exist, allow adding more
    return !lastTask.value.tasks; // Disable if the last task's value is empty
  }
}
