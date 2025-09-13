import { inferAdditionalFields, adminClient } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'
import type { auth } from '@/lib/auth'
import { ac, roles } from '@/lib/permissions'

const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  plugins: [inferAdditionalFields<typeof auth>(), adminClient({ ac, roles })]
})

// You can also check multiple resource permissions at the same time

export const canCreateProject = await authClient.admin.hasPermission({
  permissions: {
    project: ['create']

    // sale: ["create"]
  },

  role: 'manager'
})

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
  admin,
  sendVerificationEmail,
  forgetPassword,
  resetPassword,
  updateUser
} = authClient
