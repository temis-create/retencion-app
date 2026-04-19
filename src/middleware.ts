import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/empresas/:path*",
    "/compras/:path*",
    "/pagos/:path*",
    "/retenciones/:path*",
    "/fiscal/:path*",
  ],
};
