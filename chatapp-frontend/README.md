# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```

// File structure overview:
// src/
//  ├── components/
//  │   ├── dashboard/
//  │   │   ├── DashboardLayout.tsx
//  │   │   ├── Sidebar.tsx
//  │   │   ├── Header.tsx
//  │   │   └── widgets/
//  │   │       ├── StatsCard.tsx
//  │   │       ├── ActivityFeed.tsx
//  │   │       └── ChartWidget.tsx
//  │   ├── users/
//  │   │   ├── UserList.tsx
//  │   │   ├── UserForm.tsx
//  │   │   └── UserDetail.tsx
//  │   ├── roles/
//  │   │   ├── RoleList.tsx
//  │   │   ├── RoleForm.tsx
//  │   │   └── PermissionMatrix.tsx
//  │   ├── chat/
//  │   │   ├── ChatLayout.tsx
//  │   │   ├── MessageList.tsx
//  │   │   ├── MessageInput.tsx
//  │   │   └── GroupList.tsx
//  │   └── settings/
//  │       ├── SettingsLayout.tsx
//  │       ├── GeneralSettings.tsx
//  │       └── SecuritySettings.tsx
//  ├── pages/
//  │   ├── Dashboard.tsx
//  │   ├── UserManagement.tsx
//  │   ├── RoleManagement.tsx
//  │   ├── GroupChat.tsx
//  │   └── Settings.tsx
//  ├── hooks/
//  │   ├── useAuth.ts
//  │   ├── useUsers.ts
//  │   ├── useRoles.ts
//  │   ├── useChat.ts
//  │   └── useSettings.ts
//  ├── types/
//  │   ├── user.types.ts
//  │   ├── role.types.ts
//  │   ├── chat.types.ts
//  │   └── settings.types.ts
//  ├── services/
//  │   ├── api.ts
//  │   ├── userService.ts
//  │   ├── roleService.ts
//  │   ├── chatService.ts
//  │   └── settingsService.ts
//  ├── utils/
//  │   └── common.ts  // The helper file you asked for previously
//  ├── context/
//  │   ├── AuthContext.tsx
//  │   └── ThemeContext.tsx
//  └── routes/
//      └── AppRoutes.tsx