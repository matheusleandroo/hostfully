# Hostfully Project

A responsive React application built for the **Hostfully Test**, following modern frontend development best practices.  
This project is fully configured with **Tailwind CSS**, **ESLint**, **Prettier**, and **EditorConfig**, and includes automated tests to ensure high code quality.

> ⚠️ **Important:** This project requires **Node.js version 24.8.0** for proper execution.  
> Using a different Node version may cause installation or runtime issues.

---

## 🚀 Features

- **Responsive UI** optimized for desktop and mobile
- **Attractive interface** with vibrant but balanced colors
- **Toast notifications** using [react-toastify](https://github.com/fkhadra/react-toastify)
- **Pre-configured development tools**:
  - ESLint (code linting)
  - Prettier (code formatting)
  - EditorConfig (consistent editor behavior)
- **Comprehensive test coverage** with React Testing Library and Jest
- **Reusable components** and clean architecture

---

## 🧩 Tech Stack

- **React 18**
- **TypeScript**
- **Vite**
- **Tailwind CSS**
- **React Testing Library / Jest**
- **React Toastify**
- **ESLint + Prettier + EditorConfig**

---

## 📦 Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/YOUR_USERNAME/hostfully.git
cd hostfully
yarn install
```

or

```bash
npm install
```

Ensure you are using Node.js **v24.8.0**. You can verify it with:

```bash
node -v
```

---

## 🧠 Scripts

Run the development server:

```bash
yarn dev
```

Run tests:

```bash
yarn test
```

Build for production:

```bash
yarn build
```

Preview the production build:

```bash
yarn preview
```

Lint the project:

```bash
yarn lint
```

---

## 🧪 Testing

The project includes unit and integration tests to ensure the app’s stability and correctness.  
Run all tests with:

```bash
yarn test
```

---

## 🎨 Design

The UI was built with **Tailwind CSS**, providing a clean, modern, and slightly colorful layout.  
Components were designed to be reusable, accessible, and maintainable.

---

## 🔔 Notifications

The project uses **React Toastify** for user feedback (success, error, info).  
Example:

```tsx
import { toast } from 'react-toastify'

toast.success('Action completed successfully!')
```

---

## ⚙️ Configuration Files

- `.eslintrc.json` — linting rules
- `.prettierrc` — code formatting
- `.editorconfig` — editor configuration consistency
- `vite.config.ts` — build and dev server configuration
- `tailwind.config.js` — Tailwind setup

---

## 🧑‍💻 Author

Developed by **Matheus Leandro**  
[LinkedIn](https://www.linkedin.com/in/mattleandroo/) • [Portfolio](https://matheusleandro.com)

---

## 📄 License

This project is licensed under the **MIT License** — feel free to use and modify it.
