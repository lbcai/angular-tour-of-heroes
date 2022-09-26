import { Component, OnInit } from '@angular/core';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {

  // is also injected into the HeroService, must be public because Angular only binds to public component properties
  constructor(public messageService: MessageService) { }

  ngOnInit(): void {
  }

}
