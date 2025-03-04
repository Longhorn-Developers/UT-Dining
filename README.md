# UT Dining Hall

UT Dining Hall is a mobile application that provides comprehensive dining hall information such as menus, payment methods, and location details.

## Tech Stack

- **Framework:** Expo, React Native
- **State Management:** Zustand
- **Database:** Supabase
- **Styling:** NativeWind
- **Build Tools:** pnpm, Metro bundler

## Setup

1. **Clone the Repository**

   ```sh
   git clone https://github.com/EthanL06/ut-dining-hall.git
   cd ut-dining-hall
   ```

2. **Install Dependencies**

   ```sh
    pnpm install
   ```

3. **Run Local Supabase Instance**

   For this step, you need [Docker Desktop](https://docs.docker.com/desktop/) installed on your machine. Follow the guide to install it on your system.

   Next, install the Supabase CLI. Follow the guide [here](https://supabase.com/docs/guides/local-development/cli/getting-started?queryGroups=platform&platform=macos#installing-the-supabase-cli).

   After installing the Supabase CLI, run the following command to start a local Supabase instance:

   ```sh
   supabase start
   ```

   Once it's up and running, you should see a message like this in the terminal:

   ```sh
   Started supabase local development setup.

         API URL: http://localhost:54321
          DB URL: postgresql://postgres:postgres@localhost:54322/postgres
      Studio URL: http://localhost:54323
    Inbucket URL: http://localhost:54324
        anon key: eyJh......
   service_role key: eyJh......
   ```

   The `API URL` and `anon key` are the environment variables you need to configure in the next step.

4. **Configure Environment Variables**

   Use the `.env-example` file to create a `.env` file in the root directory and add the following environment variables:

   ```sh
    EXPO_PUBLIC_SUPABASE_URL=<supabase-url>
    EXPO_PUBLIC_SUPABASE_ANON_KEY=<supabase-anon-key>
   ```

   Replace `<supabase-url>` and `<supabase-anon-key>` with the values `API URL` and `anon key` from the previous step.

5. **Start the Development Server**

   For iOS:

   ```sh
    pnpm run ios
   ```

   For Android:

   ```sh
   pnpm run android
   ```

   To tunnel the server to your phone (if you're using a physical device on public wifi):

   ```sh
   pnpm run ios --tunnel
   pnpm run android --tunnel
   ```

   > NOTE: This may not work with connecting to the Supabase instance. You may need to use an [iOS](https://docs.expo.dev/workflow/ios-simulator/) or [Android](https://docs.expo.dev/workflow/android-studio-emulator/) emulator on your computer instead.
