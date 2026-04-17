# Hello Neighbor
**ALX Africa Final Project**
*Developed by Montassar Hajri*

[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-2.103-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.2-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![OpenLayers](https://img.shields.io/badge/OpenLayers-10.9-1F6B75)](https://openlayers.org/)

A community-focused web application connecting neighbors through localized communication, events, resource sharing, and neighborhood moderation.

![Hello Neighbor Logo](public/imgs/logo.png)
*Hello Neighbor - Building stronger communities*

## Table of Contents
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Scripts](#scripts)
- [Database Schema](#database-schema)
- [Development Notes](#development-notes)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [Acknowledgments](#acknowledgments)
- [Contact](#contact)

## Key Features

### Community Engagement
- Location-verified neighborhood access
- Event management with RSVP tracking
- Real-time emergency alerts
- Neighborhood chat channels

### Marketplace
- Local item exchange platform
- Geo-fenced search radius
- Image upload for listings
- Peer-to-peer rating system

### Security and Privacy
- GPS verification with fallback
- Role-based access control
- End-to-end encryption for messages
- Anonymous reporting system

## Tech Stack

### Frontend
| Technology | Version | Purpose |
| --- | --- | --- |
| React | 19.2.5 | Core UI framework |
| TypeScript | 6.0.2 | Type safety |
| Vite | 8.0.8 | Dev server and production bundling |
| Tailwind CSS | 4.2.2 | Styling system |
| shadcn/ui | Project components | Accessible UI primitives |
| React Router | 7.14.1 | Navigation and routing |
| TanStack Query | 5.99.0 | Server state and caching |
| OpenLayers (`ol`) | 10.9.0 | Maps and geospatial UI |

### Supporting Libraries
- `@supabase/auth-ui-react` and `@supabase/auth-ui-shared` for sign-in and sign-up screens
- `@supabase/supabase-js` for backend access
- `react-hook-form` for form handling
- `react-dropzone` for file uploads
- `lucide-react` for icons
- `clsx`, `class-variance-authority`, and `tailwind-merge` for UI composition

### Backend
| Technology | Purpose |
| --- | --- |
| Supabase | Backend platform |
| PostgreSQL | Relational database |
| PostGIS | Geographic data handling |
| Row Level Security (RLS) | Access control |
| Storage Buckets | File uploads |
| Edge Functions | Serverless logic |
| Realtime API | Live updates |

## Installation

### Prerequisites
- Node.js 20+ recommended
- npm
- Supabase account
- Git

### Setup Instructions

1. Clone the repository
```bash
git clone <your-repo-url>
cd HelloNeighbor-community-web-application
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
Create a `.env` file in the project root:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up the Supabase database
- Create a new Supabase project
- Run the SQL migration in `backup.sql`
- Apply the RLS fixes in `fix-rls-policies.sql`

5. Start the development server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## Scripts

- `npm run dev` starts the Vite dev server
- `npm run build` builds the app for production
- `npm run build:dev` builds in development mode
- `npm run lint` runs ESLint across the codebase
- `npm run preview` previews the production build locally

## Database Schema

The application uses PostgreSQL with PostGIS for geographic data. Key tables include:

- `users` - user profiles with location data
- `neighborhoods` - community boundaries and settings
- `posts` - community posts and announcements
- `events` - local events with RSVP tracking
- `marketplace_listings` - item exchange platform
- `messages` - neighborhood chat conversations
- `alerts` - emergency notifications

See `backup.sql` for the full schema and `fix-rls-policies.sql` for the access control updates.

## Development Notes

- The app uses OpenLayers for mapping and geospatial interactions, not Mapbox or Leaflet.
- Supabase handles authentication, database access, storage, and realtime updates.
- The current stack is aligned with React 19, TypeScript 6, Vite 8, and Tailwind CSS 4.

## Roadmap

- Mobile app development
- Push notification system
- Advanced moderation tools
- Multi-language support
- Integration with local government APIs
- Offline mode support

## Contributing

Contributions are welcome. Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

Please keep changes aligned with the existing style and include tests where appropriate.

## Acknowledgments

- [ALX Africa](https://www.alxafrica.com/) for the software engineering program
- [Supabase](https://supabase.com/) for the backend infrastructure
- [shadcn/ui](https://ui.shadcn.com/) for the component patterns
- [OpenLayers](https://openlayers.org/) for map rendering
- The open-source community for ongoing inspiration

## Contact

**Montassar Hajri**

- GitHub: [@MontaCoder](https://github.com/MontaCoder)
