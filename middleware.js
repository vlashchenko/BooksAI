// /Users/sv/Documents/Projects/AI/newai/middleware.js

import { withAuth } from "next-auth/middleware";
import { options } from "./app/api/auth/options"; // Correct relative path

export default withAuth(options);

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};