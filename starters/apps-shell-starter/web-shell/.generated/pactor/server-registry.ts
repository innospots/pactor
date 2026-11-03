import { handlers as pactor_app_risk_analysisHandlers } from "risk-analysis/server";

import type {
  ModuleApiHandlers,
  ModuleServerRegistry,
} from "@/server/modules/types";

export const moduleServers: ModuleServerRegistry = {
  "pactor-app-risk-analysis": {
    moduleId: "pactor-app-risk-analysis",
    package: "risk-analysis",
    prefixes: ["/api/risk-analysis"],
    handlers: pactor_app_risk_analysisHandlers as ModuleApiHandlers,
  },
};
