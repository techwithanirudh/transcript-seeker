# Firebase Deployment Guide

Learn how to deploy Transcript Seeker to Firebase.

## Setup

### Firebase Hosting

To learn more about Firebase Hosting, check out the official [Firebase Hosting Documentation](https://firebase.google.com/docs/hosting).

### Using Firebase CLI

#### 1. Install Firebase CLI Globally

Always try to use the latest version of the Firebase CLI.

```bash
npm install -g firebase-tools@latest
```

**Note**: You need to be on version [^11.18.0](https://github.com/firebase/firebase-tools/releases/tag/v11.18.0) or higher to deploy a `nodejs18` function.

#### 2. Log in to Your Firebase Account

Log in to your Firebase account:

```bash
firebase login
```

#### 3. Prepare Your Environment

Install dependencies if not done already:

```bash
pnpm install
```

Copy over the environment variables:

```bash
cp .env.example .env
```

Build the project:

```bash
pnpm build
```

## Nitro

> You need to be on the **Blaze plan** to use Nitro with cloud functions.

Navigate to the Nitro application directory:

```sh
cd apps/nitro
```

### Local Preview

You can preview a local version of your site if you need to test things out without deploying:

```bash
NITRO_PRESET=firebase pnpm build
firebase emulators:start
```

### Build and Deploy

To deploy to Firebase Hosting, run a Nitro build and then deploy:

```bash
NITRO_PRESET=firebase pnpm build
```

```bash
firebase deploy
```

## Frontend Deployment

Navigate to the frontend application directory:

```sh
cd apps/web
```

### Build and Deploy

To deploy the frontend to Firebase Hosting, build the project and deploy:

```bash
pnpm build
```

```bash
firebase deploy
```
