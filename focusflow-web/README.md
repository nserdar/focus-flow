# Focus Flow Web

Modern web frontend for Focus Flow - Personal Productivity & Time Management application.

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Axios** - HTTP client
- **Lucide React** - Icons

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env.local` file with:
```
NEXT_PUBLIC_API_URL=http://localhost:8081/api
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- ✅ User authentication (Login/Register)
- ✅ Dashboard with statistics
- ✅ Task management (CRUD operations)
- ✅ Goal management
- ✅ Focus session tracking
- ✅ Responsive design
- ✅ Modern UI with Tailwind CSS

## Project Structure

```
focusflow-web/
├── app/                    # Next.js app router pages
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   ├── dashboard/         # Dashboard page
│   └── tasks/             # Tasks page
├── components/            # React components
│   └── Navbar.tsx        # Navigation bar
├── lib/                   # Utilities and services
│   ├── api.ts            # Axios configuration
│   └── services/         # API service functions
├── store/                 # Zustand stores
│   └── authStore.ts      # Authentication state
└── types/                 # TypeScript type definitions
    └── index.ts          # Shared types
```

## API Integration

The frontend communicates with the backend API running on `http://localhost:8081/api`. Make sure the backend is running before starting the frontend.

## License

Copyright (c) 2024 nserdar. All Rights Reserved.

This project is **proprietary and confidential**. No part of this software,
documentation, or associated materials may be used, copied, modified,
distributed, or disclosed without prior written authorization from the Owner.
See the [LICENSE](../LICENSE) file at the repository root for full terms.

## Usage Restrictions

Unauthorized use, reproduction, or distribution of any part of this project is
strictly prohibited. This includes sharing source code, configuration, UI
assets, or any other project materials externally (e.g., on public forums,
social media, blog posts, or in portfolios) without explicit written permission
from the Owner. If you have questions about permitted use, contact the Owner via
[GitHub](https://github.com/nserdar).
