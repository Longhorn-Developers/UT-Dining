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

   Go to the [UT Dining Hall repository](https://github.com/EthanL06/ut-dining-hall.git) and click the "Fork" button in the top-right corner of the page.

   After forking, clone the repository to your local machine:

   ```sh
   git clone https://github.com/<your-username>/ut-dining-hall.git
   cd ut-dining-hall
   ```

2. **Install Dependencies**

   ```sh
    pnpm install
   ```
3. **Configure Environment Variables**

   Use the `.env-example` file to create a `.env` file in the root directory and add the following environment variables:

   ```sh
    EXPO_PUBLIC_SUPABASE_URL=<supabase-url>
    EXPO_PUBLIC_SUPABASE_ANON_KEY=<supabase-anon-key>
   ```

   Ask Ethan for details about this.

4. Create an expo account at expo.dev. Once you create the account, you can log in with:

   ```sh
   npx expo login
   ```


5. **Start the Development Server**

   - **For iOS:**

     ```sh
     pnpm run start
     ```

     - Scan the QR code displayed in the terminal on your iPhone to view the app.

   - **For Android:**

     ```sh
     pnpm run start
     ```

     - Scan the QR code displayed in the terminal on your Android phone or IPhone to view the app.

     - To run the app on an Android emulator (requires Android SDK):
       - Download and install **Android Studio** from [here](https://developer.android.com/studio).
       - After installation, configure the **SDK path** variable in the system environment.
       - In Android Studio, open the **Virtual Devices** manager and launch a virtual Android device.
       - Once the emulator is running, go back to the UT Dining repository, open the Android project, and you're all set!


6. **Tunneling for Physical Devices**

   If you're using a physical device on a public Wi-Fi network, use the following commands to tunnel the server to your device:

   ```sh
   pnpm run ios --tunnel
   pnpm run android --tunnel
   ```

   > **NOTE:** This may not work with connecting to the Supabase instance. You may need to use an [iOS](https://docs.expo.dev/workflow/ios-simulator/) or [Android](https://docs.expo.dev/workflow/android-studio-emulator/) emulator instead.
