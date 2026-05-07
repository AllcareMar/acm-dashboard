# ACM Dashboard - Auto-Refresh System

Automated weekly BOB refresh for the AllCare Mar IMO-UHC dashboard, deployed on **GitHub Pages**.

## Stack tecnológico (todo gratis)

- 📦 **GitHub** → repositorio de código
- 🌐 **GitHub Pages** → hosting del dashboard (link permanente)
- ⚙️ **GitHub Actions** → automatización cada 10 minutos
- 📁 **Google Drive** → carpetas /New y /Archive para BOB files
- 📧 **Gmail SMTP** → notificaciones automáticas

## ¿Cómo funciona?

1. Cada 10 minutos, GitHub Actions revisa la carpeta Google Drive `/New`
2. Cuando subes un BOB nuevo:
   - Mueve el viejo a `/Archive`
   - Procesa el nuevo BOB
   - Regenera el `index.html`
   - Hace `git push` → GitHub Pages deploya solo
   - Te envía email de confirmación

## Setup inicial (una sola vez)

Sigue **`docs/PRODUCTION_SETUP.md`** o el PDF **`docs/ACM_Dashboard_Setup_Guide.pdf`**.

Tiempo: ~60-75 minutos.

## URL del dashboard (después del setup)

```
https://TU_USUARIO.github.io/acm-dashboard/
```

Esta URL es **permanente** — nunca cambia.
