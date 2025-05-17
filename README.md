
# MemcachedUI

A modern web interface for managing and monitoring Memcached servers.

## Project info

**URL**: https://lovable.dev/projects/9df58439-67f7-40b9-8129-fc09d427bf98

## Features

- Key management (view, edit, delete)
- Tree view for nested keys
- Statistics monitoring
- Import/Export functionality
- Server operations (flush cache)
- Dark/light theme support

## Development

### Prerequisites

- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Local Development

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd memcachedui

# Copy environment template and configure it
cp .env.template .env

# Install dependencies
npm i

# Start the development server
npm run dev
```

## Deployment

### Using Docker

The easiest way to deploy MemcachedUI is using Docker and Docker Compose:

1. Clone the repository
2. Configure environment settings:
   ```sh
   cp .env.template .env
   # Edit .env with your Memcached server details
   ```
3. Build and start containers:
   ```sh
   docker-compose up -d
   ```
4. Access the UI at `http://localhost:8080`

### Manual Deployment

1. Build the application:
   ```sh
   npm run build
   ```

2. Deploy the contents of the `dist` directory to your web server.

3. Configure your web server (like Nginx) to serve the application and handle SPA routing.

## Technology Stack

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- React Router
- React Query

## License

MIT
