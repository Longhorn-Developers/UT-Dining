![UT Dining Logo](https://github.com/user-attachments/assets/21c5d1d5-e0c2-41d6-b171-79f8364bd050)

# UT Dining

UT Dining is a mobile application that provides comprehensive information about dining options at the University of Texas at Austin, including menus, nutrition data, allergens, and more.

> This project has been adopted by [Longhorn Developers](https://github.com/Longhorn-Developers). Huge thanks to Ethan Lanting (@EthanL06) for creating it!

**Currently in Beta ‼️‼️**<br/>
Join the Beta Test here _(iOS only)_: [TestFlight - UT Dining](https://testflight.apple.com/join/y3FUJUqN)

![UT Dining App Screenshot](https://github.com/user-attachments/assets/f095381b-b850-4c99-9748-8b4864226af4)

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [How it Works](#how-it-works)
4. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
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
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- A physical mobile device with [Expo Go](https://expo.dev/client) installed or an emulator. Follow the guide [here](https://docs.expo.dev/workflow/android-studio-emulator/) to set up an Android emulator or [here](https://docs.expo.dev/workflow/ios-simulator/) for an iOS simulator.
- [Tailwind CSS Intellisense Extension](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) for Visual Studio Code (optional, but highly recommended)

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

   Copy the `.env-example` file to create a `.env` file:

   ```sh
   cp .env-example .env
   ```

   Update with your Supabase `API URL` and `anon key` credentials:

   ```sh
    EXPO_PUBLIC_SUPABASE_URL=<supabase-url>
    EXPO_PUBLIC_SUPABASE_ANON_KEY=<supabase-anon-key>
   ```

   > If not running Supabase locally, ask [@EthanL06](https://github.com/EthanL06) for environment variables.

5. **Create an Expo Account**

   Create an account at [expo.dev](https://expo.dev). Once you create the account, you can log in with:

   ```sh
   npx expo login
   ```

6. **Setup the Development Build**

   Since the app uses [react-native-mmkv](https://github.com/mrousavy/react-native-mmkv?tab=readme-ov-file) instead of `AsyncStorage`, you must run it with a development build rather       than Expo Go.  

   Run the following commands to build the development version:  

   - **For iOS:**  
     ```sh
     pnpm run ios
     ```
     
    - **For Android:**
     ```sh
     pnpm run android
     ```
    
     If you’re developing for both platforms, run both commands.
      
     > **Note**: The build process may take some time. Please wait until it completes.
   

6. **Start the Development Server**
   ```sh
   pnpm run start
   ```

   Make sure that you are using `development build` instead of `Expo Go` when running the app. You can switch to the development build by pressing `s` in the terminal.

   **Tunneling for Physical Devices**

   If you're using a physical device on a public Wi-Fi network, use the following commands to tunnel the server to your device:

   ```sh
   pnpm run start --tunnel
   ```

   > Note: Tunneling may have limitations with Supabase connections. Using an emulator is recommended for full functionality.

   **Debugging Drizzle with Drizzle Studio**

   While the development server is running, press `Shift + M` in the terminal and select `expo-drizzle-studio-plugin` to open Drizzle Studio in your browser. You can use this tool to inspect the SQLite database and troubleshoot any issues related to the local cache with SQLite and Drizzle ORM. Read more about Drizzle Studio [here](https://orm.drizzle.team/drizzle-studio/overview).

8. **Launch Emulators**

   To open the app on an emulator, press either of the following keys in the terminal:

   - `a` to open on Android emulator
   - `i` to open on iOS simulator

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
├── types/             # TypeScript type definitions
└── utils/             # Helper functions and utilities
```

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

2. **[UT Dining Website](https://github.com/Longhorn-Developers/ut-dining-website)**<br>
   This repository hosts the code for the UT Dining website.

## License

This project is licensed under the MIT License.

You are free to use, modify, and distribute this software under the terms of the MIT License. See the [LICENSE](https://github.com/Longhorn-Developers/UT-Dining/blob/main/LICENSE) file for more details.
