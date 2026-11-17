import { extensions as pactor_app_data_analysisExtensions } from "data-analysis/client";
import { extensions as pactor_app_product_centerExtensions } from "product-center/client";
import { extensions as pactor_app_general_appExtensions } from "general-app/client";

import type { ModuleExtensionBundle } from "@pactor-app/shell/client";

export const moduleExtensions: Record<string, ModuleExtensionBundle> = {
  "pactor-app-data-analysis": pactor_app_data_analysisExtensions,
  "pactor-app-product-center": pactor_app_product_centerExtensions,
  "pactor-app-general-app": pactor_app_general_appExtensions,
};
