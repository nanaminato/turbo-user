import {ModelKeyBind} from "./model-key-bind";

export interface SupplierKey{
  supplierKeyId?: number;
  baseUrl?: string;
  apiKey?:string;
  requestIdentifier: number;
  enable?:boolean;
  modelKeyBinds?: ModelKeyBind[];
}
