import { handlers as pactor_app_general_appHandlers } from "general-app/server";

import type {
  ModuleApiHandlers,
  ModuleServerRegistry,
} from "@pactor-app/shell/server";

export const moduleServers: ModuleServerRegistry = {
  "pactor-app-general-app": {
    moduleId: "pactor-app-general-app",
    package: "general-app",
    prefixes: ["/api/general-app"],
    handlers: pactor_app_general_appHandlers as ModuleApiHandlers,
  },
};
