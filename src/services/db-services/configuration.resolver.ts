import {inject, Injectable} from "@angular/core";
import {ConfigurationService} from "./configuration.service";

@Injectable()
export class ConfigurationResolver{
    configurationService = inject(ConfigurationService);
    resolve() {
        return this.configurationService.accept();
    }
}
