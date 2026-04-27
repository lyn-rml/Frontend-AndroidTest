# MultiVisio Android Test APK

Ce dossier est une copie du frontend principal, préparée pour :
- une authentification locale par code d'accès
- un build EAS Android en `.apk`
- un test sur téléphone Android branché en USB avec `adb reverse`

## Codes d'accès de test

- Agent : `AGENT-2026`
- Admin : `ADMIN-2026`

## Mode réseau Android

Le projet est configuré avec :
- `androidConnectionMode: "adb-reverse"`

Cela veut dire :
- sur téléphone Android branché en USB, l'app appelle `127.0.0.1`
- `adb reverse` redirige ce port du téléphone vers le PC

Si tu veux viser un émulateur Android Studio à la place, change :
- `expo.extra.androidConnectionMode` en `emulator`

## Commandes utiles

### 1. Démarrer le backend sur le PC

```powershell
cd Backend
npm run dev
```

### 2. Installer les dépendances du frontend de test

```powershell
cd Frontend-AndroidTest
npm install
```

### 3. USB debugging : connecter le téléphone au backend du PC

```powershell
adb devices
adb reverse tcp:3000 tcp:3000
adb reverse tcp:8081 tcp:8081
```

### 4. Lancer l'app en dev sur Android

```powershell
cd Frontend-AndroidTest
npx expo start --android
```

### 5. Initialiser le repo Git local

```powershell
cd Frontend-AndroidTest
git init -b main
git add .
git commit -m "Initial Android test app"
```

### 6. Lier le projet à un repo distant

```powershell
git remote add origin <URL_DU_REPO_GIT>
git push -u origin main
```

### 7. Initialiser EAS

```powershell
cd Frontend-AndroidTest
npx eas login
npx eas init
```

### 8. Générer un APK Android

```powershell
npx eas build -p android --profile preview
```

Le profil `preview` est déjà configuré dans `eas.json` pour produire un `.apk`.
