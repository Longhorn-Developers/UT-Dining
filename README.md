![UT Dining Logo](https://github.com/user-attachments/assets/21c5d1d5-e0c2-41d6-b171-79f8364bd050)

# UT Dining

UT Dining is your companion app for exploring dining options at the University of Texas at Austin.
Browse menus, check dining hours, and find the perfect meal on campus.

> This project has been adopted by [Longhorn Developers](https://github.com/Longhorn-Developers). Originally created by [Ethan Lanting](https://github.com/EthanL06).

<a href="https://apps.apple.com/us/app/ut-dining/id6743042002">
   <img alt="Download on the app store" src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" height="48">
</a>

![UT Dining App Screenshot](https://github.com/user-attachments/assets/04b49653-3202-43ce-8ecc-7a19fed814ce)

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [How it Works](#how-it-works)
4. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [VSCode Extensions](#vscode-extensions)
   - [Installation](#installation)
5. [Project Structure](#project-structure)
6. [Contributing](#contributing)
7. [Related Repositories](#related-repositories)
8. [License](#license)

## Features

- **Real-time Menu Updates**: View current menus for all UT Austin dining locations
- **Favorites**: Save your favorite food items and get notified when they appear on menus
- **Meal Planning**: Create daily meal plans with nutrition tracking
- **Allergen Information**: Filter food items based on dietary restrictions and allergens
- **Location Information**: Check operating hours, location details, and whether dining halls are currently open
- **Microwave Map**: Find microwaves on campus to heat up your food

## Tech Stack

- **Framework**: [Expo](https://expo.dev/) + [React Native](https://reactnative.dev/)
- **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/)
- **Global State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Database**:
  - Remote: [Supabase](https://supabase.com/)
  - Local: [SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/) with [Drizzle ORM](https://orm.drizzle.team/) (learn more [here](https://expo.dev/blog/modern-sqlite-for-react-native-apps))
- **Styling**: [NativeWind](https://www.nativewind.dev/) (Tailwind CSS for React Native)
- **Icons**: [Lucide React Native](https://lucide.dev/guide/packages/lucide-react-native)

## How it Works

<img src="https://github.com/user-attachments/assets/f1264b22-d0ad-44e8-9342-ec53ec94d37b"><br>

At the core of the system is a remote **Render** instance, which is scheduled to run every 24 hours at 7:00 AM UTC _(or 1:00 AM CST)_. This instance is responsible for scraping the dining menus from UT Austin, sourced from [this page](https://hf-foodpro.austin.utexas.edu/foodpro/location.aspx). Once the menus are scraped, the data is stored in a **Supabase** database.

Every 24 hours, the **Expo** mobile application fetches the latest menu data from the database, keeping the application up-to-date. To optimize performance and reduce loading times, the data is cached locally in an **SQLite** database using **Drizzle ORM**. This local cache allows the app to quickly retrieve the necessary information, ensuring a smooth, **offline-first** user experience.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [pnpm](https://pnpm.io/installation)
- [Docker Desktop](https://docs.docker.com/desktop/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- An iOS or Android emulator. Follow the guide [here](https://docs.expo.dev/workflow/android-studio-emulator/) to set up an Android emulator or [here](https://docs.expo.dev/workflow/ios-simulator/) for an iOS simulator.

### VSCode Extensions

We recommend using the following VSCode extensions to improve your development experience:

- **[ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)**: For identifying and fixing linting issues.
- **[Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)**: For automatic code formatting.
- **[Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)**: For Tailwind CSS class autocomplete and IntelliSense.

### Installation

1. **Fork the Repository**

   Go to the [UT Dining repository](https://github.com/Longhorn-Developers/UT-Dining.git) and click the [Fork](https://github.com/Longhorn-Developers/UT-Dining.git) button in the top-right corner of the page.

   After forking, clone the repository to your local machine:

   ```sh
   git clone https://github.com/<your-username>/ut-dining.git
   cd ut-dining
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

   **Optional: Setting up Related Services**

   If you want to work with the complete UT Dining ecosystem, you can also set up:

   - **[UT Dining Scraper](https://github.com/EthanL06/ut-dining-scraper)**: To seed your local Supabase database with menu data, clone the scraper repository in a separate directory and use the same `API_URL` and `anon key` from your local Supabase instance in the `.env` file.
   - **[UT Dining Dashboard](https://github.com/EthanL06/ut-dining-dashboard)**: To manage location information and other admin features through a web interface, clone the dashboard repository in a separate directory and use the same Supabase credentials in the `.env` file.

4. **Configure Environment Variables**

   Copy the `.env-example` file to create a `.env` file:

   ```sh
   cp .env-example .env
   ```

   Update with your Supabase `API URL` and `anon key` credentials:

   ```sh
    EXPO_PUBLIC_SUPABASE_URL=<supabase-url>
    EXPO_PUBLIC_SUPABASE_ANON_KEY=<supabase-anon-key>
   ```

5. **Create an Expo Account**

   Create an account at [expo.dev](https://expo.dev). Once you create the account, you can log in with:

   ```sh
   npx expo login
   ```

6. **Setup the Development Build**

   Since the app uses [react-native-mmkv](https://github.com/mrousavy/react-native-mmkv?tab=readme-ov-file) instead of `AsyncStorage`, you must run it with a development build rather than Expo Go.

   Run the following commands to build the development version:

   - **For iOS:**

     ```sh
     pnpm run ios
     ```

   - **For Android:**

     ```sh
     pnpm run android
     ```

   If you're developing for both platforms, run both commands.

   > **Note**: The build process may take some time. Please wait until it completes.

7. **Download to physical device (OPTIONAL)**

   If you want to test the app on a physical device, connect your device to your computer
   with a USB cable and run the following command:

   - **For iOS:**

   ```sh
   npx expo run:ios --device
   ```

   - **For Android:**

   ```sh
   npx expo run:android --device
   ```

   > **Note**: Make sure to enable USB debugging on your Android device. You can find the instructions [here](https://developer.android.com/studio/debug/dev-options).

   This will install the development build onto your device.

8. **Start the Development Server**

   ```sh
   pnpm run start
   ```

   Make sure that you are using `development build` instead of `Expo Go` when running the app. You can switch to the development build by pressing `s` in the terminal.

   **Tunneling for Physical Devices**

   If you're using a physical device on a public Wi-Fi network, use the following commands to tunnel the server to your device:

   ```sh
   pnpm run start --tunnel
   ```

   > Note: Tunneling may have limitations with Supabase connections. Using an emulator or development build is recommended for full functionality.

   **Debugging Drizzle with Drizzle Studio**

   While the development server is running, press `Shift + M` in the terminal and select `expo-drizzle-studio-plugin` to open Drizzle Studio in your browser. You can use this tool to inspect the SQLite database and troubleshoot any issues related to the local cache with SQLite and Drizzle ORM. Read more about Drizzle Studio [here](https://orm.drizzle.team/drizzle-studio/overview).

9. **Launch Emulators**

   To open the app on an emulator, press either of the following keys in the terminal:

   - `i` to open on iOS simulator
   - `a` to open on Android emulator

## Project Structure

```txt
ut-dining/
├── app/               # Expo Router screens and local UI components
├── assets/            # Images and static assets
├── components/        # Global reusable UI components
├── data/              # Static data and constants
├── db/                # SQLite Database schema and utilities
├── drizzle/           # Drizzle ORM migrations and metadata
├── hooks/             # Custom React hooks
├── store/             # Zustand state management
├── supabase/          # Supabase local client and utilities
├── types/             # TypeScript type definitions
└── utils/             # Helper functions and utilities
```

## Frequently Asked Questions

### General

**Q: Is this app officially affiliated with UT Austin?**  
A: No, this is a student-created project that aims to improve the dining experience at UT Austin. While we use publicly available data from UT's University Housing and Dining, we are not officially affiliated with the university (yet 👀).

**Q: Where does the menu data come from?**  
A: The menu data is scraped daily from [UT Austin's official dining page](https://hf-foodpro.austin.utexas.edu/foodpro/location.aspx) using our [UT Dining Scraper](https://github.com/EthanL06/ut-dining-scraper).

**Q: How often is the menu data updated?**  
A: The menu data is updated every day at 1:00 AM CST (7:00 AM UTC) to ensure you have the most current information.

### Development

**Q: Do I need to run the scraper to test the app locally?**  
A: No, you can develop and test most app features without running the scraper. If you want to work with real menu data, you'll need to set up the [UT Dining Scraper](https://github.com/EthanL06/ut-dining-scraper) with your local Supabase instance.

**Q: What is local Supabase development and why do I need it?**  
A: Local Supabase development means running Supabase on your own computer instead of using a hosted service. This gives you:

- A completely isolated development environment
- Freedom to experiment without affecting production data
- No need for external credentials or API keys
- Faster development since you're working with a local database

The setup requires Docker Desktop and Supabase CLI, but once configured, it provides a full Supabase environment including database, authentication, and real-time features. Check the [Supabase Local Development](https://supabase.com/docs/guides/cli/local-development) docs for more details.

**Q: Why can't I use Expo Go?**  
A: The app uses [react-native-mmkv](https://github.com/mrousavy/react-native-mmkv) for storage, which requires native code. Expo Go doesn't support native modules, so you need to use a development build instead.

**Q: I'm getting SQLite errors, what should I do?**  
A: Make sure you're using a development build and not Expo Go. If the error persists, try:

1. Delete the app from your device/emulator
2. Rebuild using `pnpm run ios` or `pnpm run android`
3. If issues continue, check Drizzle Studio (press `Shift + M` in terminal) to inspect the database

**Q: How do I test admin features?**  
A: Admin features can be tested by:

1. Setting up the [UT Dining Dashboard](https://github.com/EthanL06/ut-dining-dashboard) locally
2. Using the same Supabase credentials from your local instance
3. Accessing the dashboard through your web browser

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes using [conventional commit messages](https://www.conventionalcommits.org/):
   ```sh
   feat: add new feature
   fix: resolve issue with X
   docs: update documentation
   style: format code (no functional changes)
   refactor: restructure code without changing behavior
   test: add or update tests
   chore: update dependencies or configuration
   ```
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Related Repositories

Here are the repositories related to the UT Dining project:

1. **[UT Dining Scraper](https://github.com/EthanL06/ut-dining-scraper)**<br>
   This repository contains the code for scraping dining menus from UT Austin and storing them in the Supabase database.

2. **[UT Dining Dashboard](https://github.com/EthanL06/ut-dining-dashboard)**<br>
   This repository contains the code for the UT Dining admin dashboard, which is used to manage the menus, locations, and other admin features through a web interface.

3. **[UT Dining Website](https://github.com/Longhorn-Developers/ut-dining-website)**<br>
   This repository hosts the code for the UT Dining website.

## License

This project is licensed under the MIT License.

You are free to use, modify, and distribute this software under the terms of the MIT License. See the [LICENSE](https://github.com/Longhorn-Developers/UT-Dining/blob/main/LICENSE) file for more details.
