import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';
import {
  IAiAssistantPromptDto,
  IAiAssistantResponseDto,
  ITitleSuggestions,
  PromptDetails,
} from '@angular-monorepo/types-calendar';

@Injectable({ providedIn: 'root' })
export class AiAssistantService {
  constructor(private httpService: HttpService) {}

  public sendPrompt(
    data: IAiAssistantPromptDto
  ): Observable<IAiAssistantResponseDto> {
    return this.httpService.post('/ai-assistant', data);
  }

  public getTitlesSuggestions(
    promptDetails: IAiAssistantPromptDto
  ): Observable<IAiAssistantResponseDto> {
    return this.httpService.post('/ai-assistant/titles', promptDetails);
  }
}
