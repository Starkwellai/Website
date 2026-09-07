# reCAPTCHA Setup Guide

This project uses Google reCAPTCHA v3 to protect forms from spam and abuse. reCAPTCHA v3 is invisible and provides a better user experience compared to v2.

## Setup Instructions

### 1. Get reCAPTCHA Keys

1. Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Click "Create" to create a new site
3. Choose **reCAPTCHA v3**
4. Add your domain(s) (e.g., `localhost` for development, your production domain)
5. Accept the terms and submit
6. You'll receive:
   - **Site Key** (public key) - used in the frontend
   - **Secret Key** (private key) - used in the backend

### 2. Configure Environment Variables

#### Main App

Add these to your `.env.local` file in the root directory:

```env
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key_here
RECAPTCHA_SECRET_KEY=your_secret_key_here
```

#### AMI Landing Page

Add these to your `.env.local` file in the `AMI Landing Page/ami-landing-page/` directory:

```env
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key_here
RECAPTCHA_SECRET_KEY=your_secret_key_here
```

### 3. Forms Protected

The following forms are now protected with reCAPTCHA:

- **Main App:**
  - Contact form (`/contact`)
  - Signup form (`/signup`)

- **AMI Landing Page:**
  - Contact form (`/contact`)

### 4. How It Works

1. When a user submits a form, reCAPTCHA v3 automatically runs in the background
2. A token is generated and sent to the server along with the form data
3. The server verifies the token with Google's API
4. The form is only processed if verification succeeds

### 5. Development Notes

- If `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` is not set, the forms will still work but reCAPTCHA won't be active (a warning will be logged)
- If `RECAPTCHA_SECRET_KEY` is not set, server-side verification will be skipped (for development only)
- For production, both keys must be set for proper security

### 6. Testing

To test reCAPTCHA:

1. Make sure your environment variables are set
2. Submit a form - reCAPTCHA runs invisibly
3. Check the browser console for any warnings
4. Check the server logs for verification results

### 7. Score Threshold

The current implementation uses a score threshold of **0.5** (on a scale of 0.0 to 1.0). You can adjust this in the API routes:

- `app/api/contact/route.ts`
- `AMI Landing Page/ami-landing-page/src/app/api/contact/route.ts`

Lower scores (closer to 0.0) indicate bot-like behavior, while higher scores (closer to 1.0) indicate human-like behavior.

## Troubleshooting

- **Forms not working**: Check that `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` is set correctly
- **Verification always failing**: Check that `RECAPTCHA_SECRET_KEY` is set correctly and matches your site key
- **Domain errors**: Make sure you've added your domain (including `localhost` for development) in the reCAPTCHA admin console
