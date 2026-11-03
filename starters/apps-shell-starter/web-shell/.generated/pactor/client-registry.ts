import { extensions as pactor_app_risk_analysisExtensions } from "risk-analysis/client";
import { extensions as pactor_app_risk_decisionExtensions } from "risk-decision/client";

import type { ModuleExtensionBundle } from "@/runtime/register-extensions";

export const moduleExtensions: Record<string, ModuleExtensionBundle> = {
  "pactor-app-risk-analysis": pactor_app_risk_analysisExtensions,
  "pactor-app-risk-decision": pactor_app_risk_decisionExtensions,
};
