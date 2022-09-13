# What do I need to make this work?

1. You need a domain (.com, .org, whatever) registered under you.
2. Utilize https://sendgrid.com/
3. Setup Sender Authentication https://app.sendgrid.com/settings/sender_auth
4. Go through the steps to verify your domain with sendgrid.
5. Create an API key https://app.sendgrid.com/settings/api_keys
6. In `server/src/config.ts` fill in the information.
   6a. Leave username alone if using SendGrid
   6b. Only fill in password with API key.
7. Send a test email by writing some code to double check everything is okay. :)