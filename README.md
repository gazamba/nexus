# Nexus

A platform that automates client workflows by generating custom code and AI agents from survey data and documentation. It's a modern web application built with Next.js, Supabase, and TypeScript.

## 🚀 Features

- **Modern Tech Stack**: Built with Next.js 15, React 19, and TypeScript
- **Authentication**: Secure authentication system powered by Supabase
- **UI Components**: Rich set of accessible UI components using Shadcn UI
- **Styling**: Modern styling with Tailwind CSS and animations
- **Form Handling**: Robust form management with React Hook Form and Zod validation
- **Data Visualization**: Interactive charts and graphs using Recharts
- **Theme Support**: Dark/Light mode support with next-themes

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (Latest LTS version recommended)
- npm (Package manager)
- Supabase CLI (for local development)

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/gazamba/nexus.git
cd nexus
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with the following variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_open_ai_api_key
```

## 🚀 Development

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🏗️ Project Structure

```
├── app/              # Next.js app directory
├── components/       # Reusable UI components
├── contexts/        # React context providers
├── hooks/           # Custom React hooks
├── lib/             # Utility functions and configurations
├── public/          # Static assets
├── types/           # TypeScript type definitions
└── utils/           # Helper functions
```

## 🛠️ Built With

- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Backend and authentication
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Shadcn UI](https://www.radix-ui.com/) - UI components
- [React Hook Form](https://react-hook-form.com/) - Form handling
- [Zod](https://zod.dev/) - Schema validation

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.
