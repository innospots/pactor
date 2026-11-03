/** User information exposed by the authenticated session. */
export interface SessionUser {
  name?: string;
  username?: string;
  roles?: string[];
  permissions?: string[];
}
