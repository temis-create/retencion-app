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

        const email = credentials.email.trim().toLowerCase();
        
        const users = await prisma.usuario.findMany({
          where: { email },
        });

        if (users.length === 0) {
          throw new Error("Usuario no encontrado.");
        }

        // Si hay varios usuarios con el mismo email (multi-tenant),
        // buscamos el que coincida con la contraseña proporcionada.
        let user = null;
        for (const u of users) {
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            u.passwordHash
          );
          if (isPasswordValid) {
            user = u;
            break;
          }
        }

        if (!user) {
          throw new Error("Contraseña incorrecta.");
        }

        if (!user.activo) {
          throw new Error("Usuario inactivo.");
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
