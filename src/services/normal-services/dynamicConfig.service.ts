import {inject, Injectable} from "@angular/core";
import {ThemeSwitcherService} from "./themeSwitcher.service";
import {DEFAULT_THEME} from '../../themes/theme';
import {Configuration, DynamicConfig} from "../../models";
import {LocalizationService} from './localization.service';

// @Injectable({
//   providedIn: "root",
// })
@Injectable({
  providedIn: 'root'
})
export class DynamicConfigService{
  localization = inject(LocalizationService);
  themeSwitcherService = inject(ThemeSwitcherService);
  initDynamic(dynamic: DynamicConfig | undefined){
    if(dynamic===undefined){
      return;
    }
    dynamic.theme = this.themeSwitcherService.load(dynamic.theme);
    let lang: string | undefined;
    if(dynamic.languageIsSet){
      lang = dynamic.language;
    }else{
      lang = navigator.language;
      dynamic.language = lang;
    }
    dynamic.language = this.localization.use(lang);
  }
  public getDynamicConfig(configuration: Configuration): DynamicConfig | undefined{
    let dynamic = configuration.dynamic;
    if(dynamic===undefined||dynamic.length===0){
      return undefined;
    }
    return JSON.parse(dynamic);
  }
  public setDynamicConfig(configuration: Configuration, dynamicConfig: DynamicConfig){
    configuration.dynamic = JSON.stringify(dynamicConfig);
  }
  public getDefaultDynamicConfig(): DynamicConfig{
    return {
      theme: DEFAULT_THEME,
      language: 'zh',
      languageIsSet: false
    }
  }
}
