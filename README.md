# UT Dining Hall

UT Dining Hall is a mobile application that provides comprehensive dining hall information such as menus, payment methods, and location details.

## Tech Stack

- **Framework:** Expo, React Native
- **State Management:** Zustand
- **Database:** Supabase
- **Styling:** NativeWind
- **Build Tools:** pnpm, Metro bundler

## Setup

1. **Fork the Repository**

   Go to the [UT Dining Hall repository](https://github.com/EthanL06/ut-dining-hall.git) and click the [Fork](https://github.com/EthanL06/ut-dining-hall/fork) button in the top-right corner of the page.

   After forking, clone the repository to your local machine:

   ```sh
   git clone https://github.com/<your-username>/ut-dining-hall.git
   cd ut-dining-hall
   ```

2. **Install Dependencies**

   ```sh
    pnpm install

   ```

3. **Run Local Supabase Instance (OPTIONAL)**

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

   > If not running Supabase locally, ask [@EthanL06](https://github.com/EthanL06) for environment variables.

5. Create an expo account at [expo.dev](https://expo.dev). Once you create the account, you can log in with:

   ```sh
   npx expo login
   ```

6. **Start the Development Server**

   ```sh
   pnpm run start
   ```

   - **For Android:**

     - Scan the QR code displayed in the terminal on your Android phone or IPhone to view the app.

     - To run the app on an Android emulator (requires Android SDK):
       - Download and install **Android Studio** from [here](https://developer.android.com/studio).
       - After installation, configure the **SDK path** variable in the system environment.
       - In Android Studio, open the **Virtual Devices** manager and launch a virtual Android device.
       - Once the emulator is running, go back to the UT Dining repository, open the Android project, and you're all set!

7. **Tunneling for Physical Devices**

   If you're using a physical device on a public Wi-Fi network, use the following commands to tunnel the server to your device:

   ```sh
   pnpm run start --tunnel
   ```

   > **NOTE:** This may not work with connecting to the Supabase instance. You may need to use an [iOS](https://docs.expo.dev/workflow/ios-simulator/) or [Android](https://docs.expo.dev/workflow/android-studio-emulator/) emulator instead.
