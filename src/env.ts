import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
  RESEND_API_KEY: { schema: (value) => value ?? '' },
  CONTACT_FROM_EMAIL: { schema: (value) => value ?? '' },
});