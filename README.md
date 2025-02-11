# UT Dining Hall

UT Dining Hall is a mobile application that provides comprehensive dining hall information such as menus, payment methods, and location details.

## Tech Stack

- **Framework:** Expo, React Native
- **State Management:** Zustand (configured in [`useDataStore`](client/store/useDataStore.ts))
- **Styling:** NativeWind and Tailwind CSS
- **Build Tools:** pnpm, Metro bundler

## Setup

1. **Clone the Repository**

   ```sh
   git clone <repository-url>
   cd ut-dining-hall
   ```

2. **Install Dependencies**

   ```sh
    pnpm install
   ```

3. **Configure Environment Variables**

   Create a `.env` file in the root directory and add the following environment variables:

   ```sh
    EXPO_PUBLIC_SUPABASE_URL=<supabase-url>
    EXPO_PUBLIC_SUPABASE_ANON_KEY=<supabase-anon-key>
   ```

   Contact @EthanL06 for environment variables, or create a Supabase account and create a new project to get your own [here](https://database.new).

4. **Start the Development Server**

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
