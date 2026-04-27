# MultiVisoAppTest (Expo)

**MultiVisoAppTest** est une application mobile/web basée sur **Expo** et **React Native** (avec **expo-router**). Elle peut être lancée en mode web, sur émulateur/simulateur ou directement sur un téléphone via **Expo Go**, et peut être construite en version Android (.apk) ou iOS via **EAS Build**.

---

## 📦 Prérequis (avant installation)

- **Node.js** (recommandé >= 18)
- **npm** (inclus avec Node.js) ou **yarn**
- (Optionnel) **Expo Go** sur votre téléphone (Android ou iOS) pour tester en direct
- (Optionnel) **Android Studio** / **Xcode** si vous voulez exécuter sur émulateur/simulateur

---

## 🚀 Installation et lancement

### 1) Installer les dépendances

```bash
npm install
```

### 2) Démarrer le serveur de développement

```bash
npx expo start
```

Cela ouvrira le **dashboard Expo** dans votre navigateur et affichera un **QR code**.

---

## 🧪 Exécuter l'app (commandes utiles)

### 🌐 Web

```bash
npm run web
```

### 📱 Expo Go (téléphone)

1. Lancez `npx expo start`
2. Ouvrez l'application **Expo Go** sur votre téléphone
3. Scannez le QR code affiché dans le terminal ou dans le dashboard web

### 📱 Android (émulateur)

```bash
npm run android
```

### 📱 iOS (simulateur)

```bash
npm run ios
```



---

## 📦 Générer une build (APK / iOS)

Ce projet utilise **Expo Application Services (EAS)** pour les builds de production.

### 1) Installer EAS CLI (si besoin)

```bash
npm install -g eas-cli
```

### 2) Se connecter à Expo

```bash
eas login
```

### 3) Construire pour Android

```bash
eas build --platform android
```

### 4) Construire pour iOS

```bash
eas build --platform ios
```

---

## 🗂️ Structure du projet

- `app/` - code source (pages, composants, routage avec `expo-router`)
- `api/` - services et appels API
- `components/` - composants réutilisables
- `assets/` - images, icônes
- `scripts/` - scripts utilitaires (ex: `reset-project.js`)
- `package.json` - scripts et dépendances

---

## ➕ Besoin d'aide ?

- Lire la doc Expo : https://docs.expo.dev/
- Expo Router : https://expo.github.io/router/
- Expo Go : https://expo.dev/go

