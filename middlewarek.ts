// import { withAuth } from "next-auth/middleware";
// import { NextResponse } from "next/server";

// export default withAuth(
//   // `withAuth` augments your `Request` with the user's token.
//   function middleware(req) {
//     console.log(req.nextauth.token);
//     // return NextResponse.rewrite(new URL("/", req.url));
//   },
//   {
//     callbacks: {
//       authorized: ({ token }) => !!token,
//     },
//     pages: {
//       signIn: "/login",
//     },
//   }
// );
// // export { default } from "next-auth/middleware";
// export const config = { matcher: "/((?!login).*)" };

// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// // This function can be marked `async` if using `await` inside
// export function middleware(request: NextRequest) {
//   //   return NextResponse.redirect(new URL('/home', request.url))
//   console.log(request);
//   console.log("ttt", new URL("/", request.url));
//   return NextResponse.rewrite(new URL("/", request.url));
// }

// export const config = { matcher: "/((?!login).*)" };

import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
    signOut: "/auth/signout",
    error: "/auth/error",
  },
});
