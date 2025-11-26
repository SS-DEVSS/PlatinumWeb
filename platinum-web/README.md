# Platinum Driveline - Public Website

## Purpose
The **Platinum Driveline Web** project is the public-facing website designed for customers and distributors. It serves as the primary digital storefront and information hub, allowing users to:
- **Browse the Product Catalog**: Search and filter products by vehicle application, category, or part number.
- **View Technical Information**: Access technical sheets, bulletins, and installation guides.
- **Company Information**: Learn about Platinum Driveline, its philosophy, and warranty policies.
- **Distributor Tools**: Access resources relevant to partners and distributors.

## Tech Stack
- **Framework**: React (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Package Manager**: pnpm

## Installation

Ensure you have `node` and `pnpm` installed.

1. Navigate to the project directory:
   ```bash
   cd web/platinum-web
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

## Usage

### Development
To start the development server with hot reload:
```bash
pnpm dev
```
The application will typically run on `http://localhost:5173` (check terminal output).

### Build
To build the application for production:
```bash
pnpm build
```

### Linting
To run the linter:
```bash
pnpm lint
```
