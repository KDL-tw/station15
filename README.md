# Station 15

**Time-based underwriting for service businesses**

Station 15 is an underwriting platform that evaluates service businesses using time-based metrics and predictive models.

## Tech Stack

- **Frontend**: Next.js 16 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel
- **State Management**: Zustand + React Query

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account and project

### Setup

1. **Clone and install**:
   ```bash
   git clone https://github.com/KDL-tw/station15.git
   cd station15
   npm install
   ```

2. **Configure environment variables**:
   ```bash
   cp .env.example .env.local
   ```
   Fill in your Supabase credentials and other variables.

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Open**: http://localhost:3000

## Project Structure

```
station15/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── api/          # API routes
│   │   ├── admin/        # Admin dashboard
│   │   └── ...           # User pages
│   └── lib/              # Utilities
│       ├── supabase.ts   # Supabase client
│       └── types.ts      # TypeScript types
├── supabase/
│   └── schema.sql        # Database schema
├── scripts/
│   └── generate_data.py  # Data generation
└── public/               # Static assets
```

## API Routes

- `POST /api/v1/evaluate` - Underwriting evaluation
- `POST /api/v1/advanceCycle` - Cycle simulation
- `POST /api/v1/rules/update` - Update rules
- `GET /api/v1/business/:id` - Business metrics
- `GET /api/healthz` - Health check
- `GET /api/readiness` - Readiness check

## Environment Variables

See `.env.example` for all required variables.

**Required:**
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
- `SUPABASE_SERVICE_ROLE` - Service role key (for API routes)

**Optional (Feature Flags):**
- `FEATURE_DEMO_SIM` - Enable cycle simulation
- `FEATURE_FAKE_AUTH` - Use fake auth for development

## Deployment

### Vercel

1. Push to GitHub
2. Import project in Vercel dashboard
3. Add environment variables
4. Deploy!

The project is configured for automatic Vercel deployment.

## Development

### Local Development

```bash
npm run dev          # Start Next.js
npm run build       # Build for production
npm run start       # Start production server
npm run lint        # Run ESLint
```

### Database

Supabase schema is in `supabase/schema.sql`. Apply it via Supabase dashboard or CLI.

## License

Private
