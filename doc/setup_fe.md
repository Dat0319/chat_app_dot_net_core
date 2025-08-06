# Create Vite project
npm create vite@latest chatapp-frontend -- --template react-ts
cd chatapp-frontend

# Install dependencies
npm install @microsoft/signalr axios react-router-dom tailwindcss postcss autoprefixer

# Set up Tailwind CSS
npx tailwindcss init -p

# Install additional UI dependencies
npm install react-icons date-fns