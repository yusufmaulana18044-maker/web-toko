# VERCEL DEPLOYMENT GUIDE

## Langkah 1: Persiapan GitHub
1. Pastikan project sudah di-push ke GitHub dengan struktur:
   ```
   your-repo/
   ├── login-dashboard/
   ├── backend/
   ├── package.json
   └── vercel.json
   ```

## Langkah 2: Setup Vercel CLI (Optional)
```bash
npm install -g vercel
```

## Langkah 3: Deploy ke Vercel (3 Cara)

### Cara 1: Via Dashboard (Paling Mudah)
1. Buka https://vercel.com/dashboard
2. Klik "Add New" → "Project"
3. Import repository GitHub
4. Configure:
   - Framework: Create React App
   - Root Directory: `login-dashboard`
   - Build Command: `npm run build`
   - Output Directory: `build`
5. Tambah Environment Variable:
   - Key: `REACT_APP_API_URL`
   - Value: `https://your-backend-url` (Backend URL dari Supabase atau server lain)
6. Deploy!

### Cara 2: Via Vercel CLI
```bash
# Di root directory project
cd login-dashboard
vercel
# Ikuti prompt dan ikuti konfigurasi di atas
```

### Cara 3: Auto Deploy (Recommended)
- Setelah connect ke GitHub, setiap push ke branch utama akan auto-deploy

## Langkah 4: Update Backend URL

Setelah deploy, Vercel akan memberikan URL (misal: `https://your-project.vercel.app`)

Ganti `REACT_APP_API_URL` di Vercel Environment Variables dengan:
- Development: `http://localhost:5000` (lokal)
- Production: `https://your-backend-api.com` (backend Supabase/server lain)

## Langkah 5: CORS Configuration (Penting!)

Di backend (server.js), pastikan CORS sudah support domain Vercel:

```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-vercel-domain.vercel.app'
  ],
  credentials: true
}));
```

## Environment Variables untuk Vercel:

| Variable | Value | Contoh |
|----------|-------|--------|
| REACT_APP_API_URL | Backend API URL | https://api.yourdomain.com |

## Troubleshooting

### Error: CORS Policy
- Pastikan backend CORS configuration benar
- Tambah domain Vercel ke CORS whitelist

### Error: API not found
- Pastikan REACT_APP_API_URL sudah set dengan benar di Vercel
- Periksa backend sudah running

### Blank page / build error
- Check Vercel build logs di dashboard
- Pastikan semua dependencies sudah di package.json

## Tips

1. **Development Mode**: Pastikan backend jalan di localhost:5000
2. **Production Mode**: Ganti API URL ke backend production
3. **Environment**: Gunakan different URLs untuk dev/prod
4. **Monitoring**: Check Vercel Analytics untuk performa

## Links
- GitHub Repo: https://github.com/your-username/your-repo
- Vercel Dashboard: https://vercel.com/dashboard
- Vercel Docs: https://vercel.com/docs
