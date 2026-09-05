import {SupplierKey} from "./supplier-key";
import {Model} from "./model";

export interface ModelKeyBind {
  modelKeyBindId?: number;
  enable?:boolean;
  supplierKeyId?: number;
  supplierKey?: SupplierKey;
  modelId?: number;
  model?:Model;
  fee: number;
}
