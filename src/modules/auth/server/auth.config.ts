import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email y contraseña requeridos.");
        }

        const users = await prisma.usuario.findMany({
          where: { email: credentials.email },
        });

        if (users.length === 0) {
          throw new Error("Usuario no encontrado.");
        }

        if (users.length > 1) {
          throw new Error(
            "Este usuario pertenece a múltiples organizaciones. Selección de organización no implementada aún."
          );
        }

        const user = users[0];

        if (!user.activo) {
          throw new Error("Usuario inactivo.");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!isPasswordValid) {
          throw new Error("Contraseña incorrecta.");
        }

        // Buscar la primera empresa del tenant para ponerla por defecto
        const defaultEmpresa = await prisma.empresa.findFirst({
          where: { tenantId: user.tenantId, deletedAt: null },
          orderBy: { createdAt: "asc" },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.nombre,
          tenantId: user.tenantId,
          empresaActivaId: defaultEmpresa?.id || null,
          rolGlobal: user.rolGlobal,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.tenantId = (user as any).tenantId;
        token.empresaActivaId = (user as any).empresaActivaId;
        token.rolGlobal = (user as any).rolGlobal;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).tenantId = token.tenantId;
        (session.user as any).empresaActivaId = token.empresaActivaId;
        (session.user as any).rolGlobal = token.rolGlobal;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/logout",
  },
  session: {
    strategy: "jwt",
  },
};
