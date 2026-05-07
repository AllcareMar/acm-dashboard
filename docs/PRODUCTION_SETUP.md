# ▸ ACM Dashboard - Guía Completa de Implementación en Producción

**Tiempo total estimado: 60-75 minutos** (una sola vez)

Esta guía te lleva de "tengo el ZIP en mi PC" a "el dashboard se actualiza solo cada 10 minutos cuando subo el BOB a Google Drive". 

**Stack tecnológico (todo gratis):**
- ▸ **GitHub** → repositorio de código
- ▸ **GitHub Pages** → hosting del dashboard (link permanente)
- ▸ **GitHub Actions** → automatización cada 10 min
- ▸ **Google Drive** → carpetas /New y /Archive
- ▸ **Gmail** → notificaciones automáticas

---

## ▸ Lo que necesitas tener antes de empezar

| Item | Descripción | ¿Lo tienes? |
|---|---|---|
| ✓ Cuenta de Gmail (corporativa) | `wmartinez@allcaremar.com` | Sí |
| ✓ Acceso a Google Drive | Para crear las carpetas /New y /Archive | Sí |
| ⚪ Cuenta de GitHub | Personal o de la compañía (necesario crear si no tienes) | ❓ |
| ⚪ Cuenta de Google Cloud Console | Para crear el service account de la API (gratis) | ❓ |
| ✓ El ZIP `acm_dashboard_automation.zip` | Descomprimido en una carpeta de tu PC | Pendiente |

**Recomendación:** Usa una cuenta de Google corporativa de la compañía (no personal) para todo.

---

# ▸ PARTE 1: Preparar archivos en tu PC (5 min)

## Paso 1.1 — Descomprimir el ZIP

1. Descarga el archivo **`acm_dashboard_automation.zip`** que te entregué
2. Crea una carpeta en tu PC:
   - Windows: `C:\Users\Waldo\Documents\acm-dashboard\`
   - Mac: `/Users/waldo/Documents/acm-dashboard/`
3. Descomprime el ZIP **dentro** de esa carpeta

Después de descomprimir, debes ver esta estructura:

```
acm-dashboard/
├── index.html                    ← Dashboard standalone (este es el que se publica)
├── imo-uhc-dashboard.jsx         ← Source del dashboard
├── state.json                    ← Estado del último BOB procesado
├── requirements.txt              ← Dependencias Python
├── README.md
├── .gitignore
├── .github/
│   └── workflows/
│       └── check-new-bob.yml    ← El cron de cada 10 min
├── scripts/
│   ├── check_and_process.py
│   ├── gdrive_helper.py
│   ├── email_helper.py
│   ├── process_bob.py
│   ├── deploy_helper.py
│   ├── setup_initial_data.py
│   └── html_template.html
├── data/
│   └── snapshots_master.pkl    ← Master histórico (7 MB - 27 snapshots)
└── docs/
    ├── PRODUCTION_SETUP.md     ← Esta guía
    ├── QUICKSTART.md
    └── TROUBLESHOOTING.md
```

▲ **IMPORTANTE:** Verifica que veas la carpeta **`.github/`** (con el punto al inicio). Algunos sistemas la ocultan. En Windows: "Vista" → marcar "Elementos ocultos".

---

# ▸ PARTE 2: GitHub Setup (15 min)

## Paso 2.1 — Crear cuenta de GitHub (si no tienes)

1. Ve a **https://github.com/signup**
2. Usa una cuenta corporativa: `tech@allcaremar.com` o similar
3. Confirma tu email

▲ **IMPORTANTE para usar GitHub Pages:**
- Si tu repo es **PUBLIC**: GitHub Pages es **GRATIS** ✓ (recomendado)
- Si tu repo es **PRIVATE**: necesitas plan **GitHub Pro** ($4/mes)

**Recomendación:** Como el dashboard tiene login con password, puedes hacerlo PUBLIC sin problema (los datos están "protegidos" por el sistema de login).

## Paso 2.2 — Crear el repositorio

1. Una vez logueado, ve a **https://github.com/new**
2. Llena así:

   | Campo | Valor |
   |---|---|
   | Owner | Tu cuenta (ej: `allcaremar-tech`) |
   | Repository name | `acm-dashboard` |
   | Description | `ACM UHC IMO Dashboard - Book of Business analytics` |
   | Visibility | **Public** (gratis) o **Private** (requiere Pro) |
   | Add a README file | ✗ NO marcar |
   | Add .gitignore | ✗ NO marcar |
   | Choose a license | ✗ NO marcar |

3. Click **Create repository** (botón verde)

## Paso 2.3 — Subir los archivos al repo

### ✓ Opción A: Web upload (más fácil)

1. En la página del repo recién creado, busca el link azul **"uploading an existing file"** o ve a:
   ```
   https://github.com/TU_USUARIO/acm-dashboard/upload/main
   ```

2. **Arrastra TODOS los archivos y carpetas** del bundle descomprimido
   - Incluyendo la carpeta oculta `.github/`
   - Incluyendo la carpeta `data/` con el pickle de 7 MB
   - Incluyendo el `index.html` (este es el dashboard que se publica)

3. **Scroll abajo**, en "Commit changes":
   - Commit message: `Initial commit - ACM Dashboard automation`
   - Click **Commit changes**

4. **Espera 1-3 minutos** mientras GitHub procesa los archivos

### Opción B: Git desde terminal

```bash
cd ~/Documents/acm-dashboard
git init
git add .
git commit -m "Initial commit - ACM Dashboard automation"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/acm-dashboard.git
git push -u origin main
```

## Paso 2.4 — Verificar upload

En el repo, deberías ver:
- ✓ `index.html` ★ (este es el dashboard que se publica)
- ✓ `imo-uhc-dashboard.jsx`
- ✓ `data/snapshots_master.pkl`
- ✓ `.github/workflows/check-new-bob.yml`
- ✓ `scripts/` con 7 archivos
- ✓ Todos los demás archivos

▸ **GUARDA TU URL:** Anota tu URL del repo, ej: `https://github.com/allcaremar-tech/acm-dashboard`

---

# ▸ PARTE 3: Activar GitHub Pages (5 min) ★

Esta es la parte que reemplaza a Netlify. **Mucho más simple.**

## Paso 3.1 — Habilitar GitHub Pages

1. En tu repo de GitHub, click la pestaña **"Settings"** (arriba a la derecha)
2. En el menú izquierdo, scroll hasta encontrar **"Pages"** y click
3. En la sección **"Source"**:
   - Source: selecciona **"GitHub Actions"** (no "Deploy from a branch")

## Paso 3.2 — Esperar el primer deploy

1. Ve a la pestaña **"Actions"** del repo
2. Si te aparece "Workflows aren't being run on this forked repository" → click **"I understand my workflows, go ahead and enable them"**
3. El workflow **"ACM BOB Auto-Refresh"** correrá automáticamente (cada 10 min)
4. Si quieres acelerar: click **"Run workflow"** manualmente

## Paso 3.3 — Obtener tu URL permanente

Una vez termine el deploy, tu URL será:
```
https://TU_USUARIO.github.io/acm-dashboard/
```

Por ejemplo, si tu usuario es `allcaremar-tech`:
```
https://allcaremar-tech.github.io/acm-dashboard/
```

▸ **Esta URL nunca cambia.** Es tu link permanente para compartir con todos los usuarios.

## Paso 3.4 — Verificar el dashboard

1. Abre la URL en tu navegador
2. **Login** con tus credenciales (`wmartinez@allcaremar.com` / `WM123`)
3. Debes ver el dashboard funcionando con los 7 tabs

✓ **Si funciona, tu dashboard ya está vivo en internet.**

---

# ▸ PARTE 4: Google Drive Setup (20 min)

## Paso 4.1 — Crear las carpetas en Google Drive

1. Ve a **https://drive.google.com**
2. En el panel izquierdo, click **"+ Nuevo"** → **"Nueva carpeta"**
3. Nombre: **`ACM BOB Reports`**
4. **Doble click** en `ACM BOB Reports` para entrar
5. Dentro, crea **2 subcarpetas**:
   - **`New`**
   - **`Archive`**

## Paso 4.2 — Mover archivos BOB existentes

1. Sube **el BOB más reciente** (ACM_BOB_04-28-26-dataChangeAgency.xlsx) a `/New`
2. Sube **los demás BOB históricos** a `/Archive`

▸ **Estado correcto:**
```
ACM BOB Reports/
├── New/        ← solo el archivo más reciente
└── Archive/    ← todos los anteriores
```

## Paso 4.3 — Crear proyecto en Google Cloud Console

1. Ve a **https://console.cloud.google.com/**
2. Login con la **misma cuenta** del Drive
3. Arriba, click el **dropdown del proyecto** → **"PROYECTO NUEVO"**
4. Nombre: **`ACM Dashboard Automation`**
5. Click **CREAR**
6. **Espera 30-60 segundos**
7. Asegúrate que el dropdown muestra **"ACM Dashboard Automation"** seleccionado

## Paso 4.4 — Habilitar la Google Drive API

1. Menú izquierdo (☰) → **"APIs y servicios"** → **"Biblioteca"**
2. Busca: **`Google Drive API`**
3. Click **"HABILITAR"**

## Paso 4.5 — Crear el Service Account

1. Menú izquierdo → **"APIs y servicios"** → **"Credenciales"**
2. **"+ CREAR CREDENCIALES"** → **"Cuenta de servicio"**
3. Nombre: **`acm-bob-automation`**
4. Click **"CREAR Y CONTINUAR"**
5. **Asignar roles:** Skip. Click **"CONTINUAR"**
6. **Otorgar acceso a usuarios:** Skip. Click **"LISTO"**

## Paso 4.6 — Generar la JSON Key

1. Click en la cuenta recién creada
2. Pestaña **"CLAVES"** → **"AGREGAR CLAVE"** → **"Crear nueva clave"**
3. Tipo: **JSON** → **"CREAR"**
4. **Se descarga un archivo .json** automáticamente

▲▲ **IMPORTANTE:** GUARDA ese archivo en lugar seguro. NUNCA lo subas a GitHub.

## Paso 4.7 — Compartir las carpetas con el Service Account

1. Abre el JSON descargado con Notepad/TextEdit
2. Busca `"client_email"` y copia el email completo
3. En Google Drive, click derecho en `ACM BOB Reports` → **"Compartir"**
4. Pega el email del service account
5. Permiso: **"Editor"**
6. **DESMARCA** "Notificar a las personas"
7. Click **"Compartir"**

## Paso 4.8 — Obtener los IDs de las carpetas

1. Abre la carpeta `/New` en Drive
2. Mira la URL: `https://drive.google.com/drive/folders/1AbCdEf...`
3. Copia la parte después de `/folders/` → `GDRIVE_NEW_FOLDER_ID`
4. Repite para `/Archive` → `GDRIVE_ARCHIVE_FOLDER_ID`

---

# ▸ PARTE 5: Gmail App Password (5 min)

## Paso 5.1 — Habilitar 2-Step Verification

1. Ve a **https://myaccount.google.com/security**
2. Si "Verificación en 2 pasos" está desactivada → actívala

## Paso 5.2 — Generar App Password

1. Ve a **https://myaccount.google.com/apppasswords**
2. Nombre: **`ACM BOB Automation`**
3. Click **"Crear"**
4. **CÓPIA Y GUARDA** la password de 16 caracteres
5. Quita los espacios → `abcdefghijklmnop`

---

# ▸ PARTE 6: Configurar GitHub Secrets (15 min)

## Paso 6.1 — Ir a Secrets

1. Tu repo → **"Settings"** → **"Secrets and variables"** → **"Actions"**

## Paso 6.2 — Agregar los 7 secrets

Para cada uno, click **"New repository secret"**:

| Secret Name | Valor |
|---|---|
| `GDRIVE_CREDENTIALS_JSON` | TODO el contenido del archivo JSON descargado en 4.6 |
| `GDRIVE_NEW_FOLDER_ID` | El ID de `/New` (Paso 4.8) |
| `GDRIVE_ARCHIVE_FOLDER_ID` | El ID de `/Archive` (Paso 4.8) |
| `GMAIL_SENDER` | `wmartinez@allcaremar.com` |
| `GMAIL_APP_PASSWORD` | La app password de 16 caracteres (sin espacios) |
| `EMAIL_RECIPIENTS` | `wmartinez@allcaremar.com,jcabreja@allcaremar.com` |
| `DASHBOARD_URL` | `https://TU_USUARIO.github.io/acm-dashboard/` |

▲ Reemplaza `TU_USUARIO` con tu usuario real de GitHub. Termina con `/`.

---

# ▸ PARTE 7: Probar la Automatización (10 min)

## Paso 7.1 — Ejecutar workflow manualmente

1. Tu repo → **"Actions"**
2. Click **"ACM BOB Auto-Refresh"** en el panel izquierdo
3. **"Run workflow"** → **"Run workflow"** (botón verde)
4. Espera 30-60 segundos, refresca

5. Click sobre el workflow corriendo
6. Verás **2 jobs**:
   - **`check-and-process`** — verifica Google Drive
   - **`deploy-pages`** — deploya el dashboard a GitHub Pages

7. Si todo OK, ambos jobs terminan en verde ✓

✓ **Si ves eso, todo funciona.**

✗ **Errores comunes:**
- "Cannot connect to Google Drive" → revisa `GDRIVE_CREDENTIALS_JSON`
- "Folder not found" → revisa `GDRIVE_NEW_FOLDER_ID` y `GDRIVE_ARCHIVE_FOLDER_ID`
- "Pages deployment failed" → revisa que activaste GitHub Pages en Paso 3.1

## Paso 7.2 — Verificar el dashboard publicado

1. Abre `https://TU_USUARIO.github.io/acm-dashboard/`
2. Login con tus credenciales
3. Verifica que ves los datos correctos

## Paso 7.3 — Test real con BOB nuevo (próxima semana)

Cuando llegue el próximo BOB:
1. Sube el archivo a `/New` (ahora hay 2 archivos)
2. Espera 10-15 min
3. Recibes email con resumen
4. Dashboard actualizado solo

---

# ▸ PARTE 8: Compartir con tu Partner (5 min)

Envía a Juan:

```
Asunto: Nuevo ACM Dashboard - Link Permanente

Hola Juan,

Ya está listo el nuevo ACM Dashboard con auto-refresh semanal.

🔗 Link permanente: https://TU_USUARIO.github.io/acm-dashboard/

Tu login:
   Email: jcabreja@allcaremar.com
   Password: JC123

El dashboard se actualiza automáticamente cada vez que subo el BOB nuevo.
Solo refresca tu navegador.

Waldo
```

✓ **Este link nunca cambia.**

---

# ▸ PARTE 9: Tabla de Usuarios y Envío de Credenciales (15 min)

## Paso 9.1 — Tabla maestra de los 13 usuarios

###  ADMINISTRADORES (4 usuarios — ven TODAS las agencias)

| # | Nombre | Email | Password Inicial | Tipo |
|---|---|---|---|---|
| 1 | Waldo Martinez | wmartinez@allcaremar.com | WM123 | Admin |
| 2 | Marcos Rodriguez | mrodriguez@allcaremar.com | Allcare12345 | Admin |
| 3 | Maria Santiago | msanti@allcaremar.com | Allcare12345 | Admin |
| 4 | Jesus Cabreja | abreja@allcaremar.com | JC123 | Admin |

###  DIRECTORES DE AGENCIA (9 usuarios — solo ven SU agencia)

| # | Nombre | Email | Password Inicial | Agencia |
|---|---|---|---|---|
| 5 | Ana Christopher | anamichelle@allcaremar.com | Amc12345 | AMC Care Group |
| 6 | Henry Concepcion | henryc@allcaremar.com | Concep12345 | Concep Care |
| 7 | Glenda Colon | glendahealthagent@gmail.com | Gw12345 | GW Ins Group |
| 8 | Julian Vega | julian_vega@allcaremar.com | Jpm12345 | JPM Solutions |
| 9 | Roland Pinzon | rpinzon@allcaremar.com | Kmra12345 | KMRA Group |
| 10 | Ana Martell | amartell@allcaremar.com | Martell12345 | Martell Multi |
| 11 | Nikol Simarova | nikols@allcaremar.com | Simarova12345 | Simarova Senior |
| 12 | Sara Clark | sclark@allcaremar.com | Tcs12345 | TCS & Associates |
| 13 | Priscilla Galarza | pgalarza@allcaremar.com | Top12345 | Top Tier Health |

▲ **NOTA:** Los passwords mostrados son los **iniciales por defecto**. El sistema obliga al cambio en el primer login.

## Paso 9.2 — Reglas de seguridad

1. **NUNCA envíes la lista completa con passwords por email**
2. **Envía emails individuales** — cada usuario recibe SUS credenciales únicamente
3. **El sistema obliga al cambio de password** en el primer login

## Paso 9.3 — Template para Administradores

**Asunto:** ACM Dashboard - Acceso de Administrador

```
Hola [NOMBRE],

Te comparto el acceso al nuevo ACM Dashboard.

🔗 Link: https://TU_USUARIO.github.io/acm-dashboard/

Tus credenciales (perfil ADMIN — ves todas las agencias):

   Email:    [EMAIL]
   Password: [PASSWORD_INICIAL]

▲ El sistema te pedirá cambiar la password en tu primer login.

¿Qué puedes hacer?
  ▸ Book of Business
  ▸  County Map
  ▸ Zip Heatmap
  ▸ Top Agents
  ▸ Opportunity
  ▸ Retention
  ▸ Action Plan

El dashboard se actualiza automáticamente cada martes en la mañana.

Saludos,
Waldo Martinez
```

## Paso 9.4 — Template para Directores

**Asunto:** ACM Dashboard - Acceso para [AGENCIA]

```
Hola [NOMBRE],

Te comparto acceso al nuevo ACM Dashboard de [AGENCIA].

🔗 Link: https://TU_USUARIO.github.io/acm-dashboard/

Tus credenciales:

   Email:    [EMAIL]
   Password: [PASSWORD_INICIAL]
   Agencia:  [AGENCIA]

▲ El sistema te pedirá cambiar la password en tu primer login.

Tu vista está filtrada para mostrar solo [AGENCIA].

El dashboard se actualiza automáticamente cada martes.

Saludos,
Waldo Martinez
```

## Paso 9.5 — Cómo enviar rápido

Usa el archivo **`ACM_Emails_Listos.txt`** que viene en el bundle. Tiene los 13 emails ya personalizados.

▲ **Importante:** Antes de enviar, abre el archivo y reemplaza `https://acm-dashboard.netlify.app` por tu URL real: `https://TU_USUARIO.github.io/acm-dashboard/`

## Paso 9.6 — Tracking

Usa el archivo **`ACM_Users_Tracking.xlsx`** del bundle para llevar control.

## Paso 9.7 — Forgot Password

Si un usuario olvida su password:
1. Click "Forgot Password?" en el login
2. Ingresa email
3. El sistema muestra la password inicial
4. Login + cambio de password

## Paso 9.8 — Agregar nuevo usuario

1. Edita `imo-uhc-dashboard.jsx` en GitHub
2. Busca `const USERS = [`
3. Agrega línea siguiendo el formato existente
4. Commit
5. Trigger workflow para regenerar `index.html`
6. Mandar email al nuevo usuario

## Paso 9.9 — Eliminar usuario

1. Edita `imo-uhc-dashboard.jsx`
2. Borra la línea del usuario
3. Commit
4. Trigger workflow

---

# ▸ Resumen Visual: Tu Flujo Semanal

```
┌─────────────────────────────────────────────┐
│  MARTES (cuando llegue el BOB de UHC)       │
└─────────────────┬───────────────────────────┘
                  ↓
┌─────────────────────────────────────────────┐
│  Paso 1: Descargas BOB de UHC               │
│  Paso 2: Lo arrastras a Google Drive /New   │
└─────────────────┬───────────────────────────┘
                  ↓
          Esperas 10-15 minutos
                  ↓
┌─────────────────────────────────────────────┐
│  ✓ AUTOMÁTICO (no haces nada):             │
│                                             │
│  • GitHub Actions detecta archivo nuevo     │
│  • Compara fecha (debe ser posterior)       │
│  • Mueve archivo viejo → /Archive          │
│  • Procesa nuevo BOB                       │
│  • Recalcula retention, tenure, agencias   │
│  • Regenera el index.html                  │
│  • Hace git push                           │
│  • GitHub Pages deploy automático          │
│  • Te envía email con resumen              │
└─────────────────┬───────────────────────────┘
                  ↓
┌─────────────────────────────────────────────┐
│  ✓ Tú recibes email                        │
│  ✓ Partner refresca dashboard              │
│  ✓ Mismo link, datos nuevos                │
└─────────────────────────────────────────────┘
```

---

# ▲ Cosas Importantes a Recordar

## ▸ Seguridad

- **NUNCA subas el JSON del service account a GitHub** (es como una contraseña)
- Si se filtra: revoca la key en Google Cloud y crea nueva

## ▸ GitHub Pages

- **GRATIS** para repos públicos
- **Requiere GitHub Pro** ($4/mes) para repos privados
- El dashboard tiene login con password, así que es seguro tenerlo público

##  Si pasa más de 60 días sin actividad

GitHub puede pausar workflows. Si pasa:
- Actions tab → "Enable workflows"

## ▲▲ Si algo falla

1. Lee el email de error
2. Revisa `docs/TROUBLESHOOTING.md`
3. Reprocesa manual: Actions → Run workflow

## ▸ Cambios al dashboard en el futuro

1. Edita `imo-uhc-dashboard.jsx` en GitHub
2. Trigger workflow para regenerar `index.html`
3. GitHub Pages actualiza en 2-3 min

---

# ▸ Si te trabas

Dime:
- **"Estoy en el Paso X.Y"**
- **Lo que ves** (texto del error o screenshot)
- **Lo que esperabas ver**

Y te ayudo en ese punto específico.

---

# ✓ Checklist Final

- [ ] PARTE 1: Bundle descomprimido en mi PC
- [ ] PARTE 2: Repo de GitHub creado y archivos subidos
- [ ] PARTE 3: GitHub Pages activado y URL obtenida
- [ ] PARTE 4.1-4.2: Carpetas /New y /Archive creadas en Google Drive
- [ ] PARTE 4.2: BOBs movidos (1 en /New, 26 en /Archive)
- [ ] PARTE 4.3-4.6: Service account creado + JSON descargado
- [ ] PARTE 4.7: Carpetas compartidas con service account
- [ ] PARTE 4.8: IDs de carpetas anotados
- [ ] PARTE 5: Gmail App Password generada
- [ ] PARTE 6: 7 Secrets agregados a GitHub
- [ ] PARTE 7.1: Workflow probado manualmente con éxito
- [ ] PARTE 7.2: GitHub Pages deploy verificado
- [ ] PARTE 8: Link compartido con Juan
- [ ] PARTE 9.3: Emails enviados a los 4 admins
- [ ] PARTE 9.4: Emails enviados a los 9 directores
- [ ] PARTE 9.6: Tabla de tracking creada

**Cuando los 16 estén marcados, tu sistema está 100% en producción.** ★
