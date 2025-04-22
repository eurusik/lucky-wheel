# 🎡 Lucky Wheel

An interactive random selection wheel application. Perfect for making decisions, choosing winners, assigning tasks, or adding an element of fun to any selection process. Whether you're picking a restaurant for lunch, deciding who goes first in a game, or selecting a random winner - Lucky Wheel makes it engaging and fair.

> _This app was created in a "vibe coding" style — with a focus on creativity, fun, and rapid development. Enjoy the process and the result!_

## ✨ Features

- 🎯 Animated fortune wheel with smooth rotation
- 🛡️ Flexible immunity system: add immunity to any sector, immunity is visually shown with a star, and immune sectors are skipped automatically
- 🔄 Unified wheel data provider: supports both Firestore and localStorage, switchable via config
- 📱 Mobile responsive UI
- 🎨 Automatic color generation for options
- 📸 Screenshot capture functionality
- 💾 Automatic settings persistence
- 📊 Spin statistics tracking

## 🚀 How to Use

1. **Adding Options**
   - Click the settings button (⚙️)
   - Add new items using the "+" button
   - Enter names or options
   - Save changes

2. **Spinning the Wheel**
   - Click the "Spin" button or press spacebar
   - Wait for the animation to complete
   - The selected item will be highlighted

3. **Managing Immunity**
   - After spinning, click "Add Immunity" to make any sector immune
   - Immune sectors show a 🛡️ (shield) and are skipped on the next spin
   - Immunity can be added to any sector

4. **Additional Features**
   - Take a screenshot using the "📸" button
   - View spin statistics
   - Adjust your list at any time

## 🛠️ Tech Stack

- React + TypeScript
- Material-UI (MUI)
- HTML Canvas for animations
- Firestore (optional, via config)
- LocalStorage for data persistence

## 🔧 Project Setup

```bash
# Clone the repository
git clone https://github.com/your-username/lucky-wheel.git

# Install dependencies
cd lucky-wheel
npm install

# Run in development mode
npm run dev

# Build for production
npm run build
```

### Firebase Setup (Optional)
If you want to use Firestore as a backend:
1. Create a Firebase project and Firestore database.
2. Add a `.env.local` file with these variables:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
3. Set `DATA_SOURCE` in `src/config.ts` to `firebase`.

### Troubleshooting
- If you see errors related to Firebase, check your `.env.local` configuration and make sure all variables are set.
- For local-only mode, set `DATA_SOURCE` to `localStorage`.

## 📝 Notes

- Maximum number of participants: 12
- All settings are saved automatically
- Keyboard shortcuts supported
- Works in all modern browsers

## 🤝 Contributing

We welcome your contributions and improvements! Here's how:

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.