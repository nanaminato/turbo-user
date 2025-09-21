import {inject, Injectable} from "@angular/core";
import {SystemPromptService} from "./system-prompt.service";

@Injectable()
export class SystemPromptResolver {
  systemPromptService: SystemPromptService = inject(SystemPromptService);
  resolve() {
    return this.systemPromptService.accept();
  }
}
