import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat-demo-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-demo-button.component.html',
  styleUrls: ['./chat-demo-button.component.css'],
})
export class ChatDemoButtonComponent {
  onChatClick(): void {
    // Handle chat demo functionality
    console.log('Chat demo clicked');
  }
}
