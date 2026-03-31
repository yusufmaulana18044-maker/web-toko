# VERCEL DEPLOYMENT CHECKLIST

## Pre-Deployment
- [ ] Push project ke GitHub (pastikan sudah commit semua changes)
- [ ] Verifikasi folder structure benar (login-dashboard, backend, vercel.json)
- [ ] Test build lokal: `cd login-dashboard && npm run build`

## Vercel Setup
- [ ] Buat akun di https://vercel.com (atau login dengan GitHub)
- [ ] Install Vercel CLI (optional): `npm install -g vercel`
- [ ] Connect GitHub repository ke Vercel account

## Project Configuration di Vercel
- [ ] Root Directory: `login-dashboard`
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `build`
- [ ] Node Version: 18 (default recommended)

## Environment Variables di Vercel
- [ ] Tambah `REACT_APP_API_URL` variable
- [ ] Set value ke backend URL (misal: https://your-api.com)

## Post-Deployment
- [ ] Test semua fitur login/register
- [ ] Verify API calls berhasil tersambung
- [ ] Check Console untuk errors
- [ ] Test di mobile device

## Backend Configuration
- [ ] Update CORS di backend untuk include Vercel domain
- [ ] Test backend bisa diakses dari frontend production
- [ ] Setup environment variables di backend jika diperlukan

## Monitoring
- [ ] Enable Vercel Analytics
- [ ] Setup error tracking (misal: Sentry)
- [ ] Monitor API response times

## Optional Improvements
- [ ] Setup custom domain (domains.vercel.com atau domain provider)
- [ ] Enable auto-deploy dari branch tertentu
- [ ] Setup preview deployments untuk PR

---
✅ Setelah semua checklist selesai, project siap production!
