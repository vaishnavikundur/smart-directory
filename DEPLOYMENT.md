# 🚀 ContactFlow — Production Deployment Guide

ContactFlow is a fully-fledged, production-ready contact management suite designed to be deployed as a single, self-contained, unified Node.js application. 

In production (`NODE_ENV=production`), the backend Express API serves the pre-compiled React SPA assets directly from `frontend/dist`. This eliminates cross-origin resource sharing (CORS) hurdles, simplifies secure cookie routing, and lowers hosting costs to a single container or server.

---

## 🗺️ Architectural Architecture

```mermaid
graph TD
    Client[Web Browser] -- "1. Request App / API" --> AppServer[Express Server]
    subgraph Single Hosted Host
        AppServer -- "2. Serve Static Assets (dist/)" --> StaticFS[Frontend Build Folder]
        AppServer -- "3. Resolve Routes (/api/*)" --> Controllers[Express Controllers]
        Controllers -- "4. Fast Prefixes" --> InMemSearch[In-Memory Trie + Inverted Index]
    end
    Controllers -- "5. Persistent Storage" --> Mongo[MongoDB Atlas Cluster]
```

---

## ☁️ Option A: One-Click Cloud Hosting (Render, Railway, Heroku)

Deploying to cloud platforms like Render or Railway is the easiest and most robust method. They provide automatic SSL (HTTPS) out of the box and handle domain mapping automatically.

### Step-by-Step for Render / Railway:
1. **Push your code to GitHub/GitLab**.
2. **Create a Web Service**:
   - Link your repository to the platform.
3. **Configure Build & Start Commands**:
   - **Build Command**: `npm run build` (This installs root dependencies, compiles backend TS, and builds frontend assets).
   - **Start Command**: `npm start` (This starts the compiled backend using `node backend/dist/server.js`).
4. **Configure Environment Variables**:
   Create the following key-value pairs in the platform's Environment Variables panel:
   
   | Variable | Value / Description | Example |
   | :--- | :--- | :--- |
   | `NODE_ENV` | Must be set to `production` | `production` |
   | `PORT` | The port the host expects your server to listen on | `10000` (Render default) |
   | `MONGODB_URI` | Your production MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/prod` |
   | `JWT_SECRET` | A secure, random string for signing access tokens | *Generate a secure key (e.g. 64 random chars)* |
   | `JWT_REFRESH_SECRET` | A secure, random string for signing refresh tokens | *Generate a secure key* |

---

## 🎛️ Option B: Virtual Private Server (VPS - Ubuntu/Debian)

If you prefer to host on a Virtual Private Server (VPS) such as DigitalOcean, Linode, AWS EC2, or Hetzner, follow this production checklist.

### 1. System Requirements & Node Setup
Log into your server and install Node.js (v18+ or v20+) and Git:

```bash
# Update local packages
sudo apt update && sudo apt upgrade -y

# Install Node.js (via NodeSource v20)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs git build-essential

# Verify versions
node -v
npm -v
```

### 2. Code Cloning & Compilation
Clone the repository, create your production configuration, and build:

```bash
# Clone repository
git clone <your-repo-url> /var/www/contactflow
cd /var/www/contactflow

# Create production environment config
cp .env.example .env
nano .env  # Add your database credentials and set NODE_ENV=production

# Install and build everything
npm install
npm run build
```

### 3. Setup PM2 (Process Manager)
PM2 ensures the server runs continuously in the background, auto-restarts on server crashes, and boots automatically when the VPS reboots.

```bash
# Install PM2 globally
sudo npm install pm2 -g

# Start the application
pm2 start npm --name "contactflow" -- start

# Configure PM2 to launch on system start
pm2 startup
# (Run the output command provided by PM2 to register the startup service)

# Save process list
pm2 save
```

### 4. Setup Nginx Reverse Proxy
To serve the app securely over port `80` (HTTP) and `443` (HTTPS), use Nginx as a reverse proxy.

```bash
# Install Nginx
sudo apt install nginx -y

# Create Nginx server block
sudo nano /etc/nginx/sites-available/contactflow
```

Paste the following configuration:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000; # Forward requests to Express
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # Security & cookie proxy headers
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site and restart Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/contactflow /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default  # Remove default page
sudo nginx -t  # Test configuration
sudo systemctl restart nginx
```

### 5. Secure with SSL (Let's Encrypt)
Secure all web traffic with Let's Encrypt SSL certificates for free:

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
# Follow the prompts and select option 2 (Redirect all traffic to HTTPS)
```

---

## 🗄️ Database Setup (MongoDB Atlas)

Do not run a local MongoDB instance on your production server. Instead, use a managed cloud service like **MongoDB Atlas**.

1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com) and register for a free account.
2. Create a cluster (the **M0 Free Tier** cluster is completely free and perfect for general usage).
3. Under **Network Access**, add IP `0.0.0.0/30` to allow the cloud web host to connect, or whitelist your VPS IP for maximum security.
4. Under **Database Access**, create a user with a secure password.
5. Click **Connect** → **Drivers** to fetch your connection string, which will look like:
   `mongodb+srv://<username>:<password>@cluster0.abc.mongodb.net/contactflow?retryWrites=true&w=majority`
6. Add this string as `MONGODB_URI` in your production environment variables.

---

## 🔒 Security Summary

ContactFlow has been configured with high-standard security principles ready for production:
* **Secured Cookies**: Session refresh tokens are served via `httpOnly`, `secure` (enforced when `NODE_ENV=production`), and `sameSite: 'strict'` to completely neutralize XSS and CSRF token extraction attacks.
* **Token Rotation**: The refresh token rotation mechanism prevents session-hijacking / token reuse attacks.
* **Helmet Middleware**: Configured to restrict standard protocol headers while allowing dynamic React SPA scripts to execute natively.
