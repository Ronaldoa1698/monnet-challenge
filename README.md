# 🎭 Monnet Challenge - Playwright Automation

[![Playwright Tests](https://github.com/TU-USUARIO/monnet-challenge/actions/workflows/playwright-tests.yml/badge.svg)](https://github.com/TU-USUARIO/monnet-challenge/actions/workflows/playwright-tests.yml)

Proyecto de automatización de pruebas usando **Playwright** con TypeScript, implementando el patrón **Page Object Model (POM)** y pruebas de API/Web.

---

## 📋 Tabla de Contenidos

- [Prerequisitos](#-prerequisitos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Ejecución Local](#-ejecución-local)
- [Ejecución en GitHub Actions](#-ejecución-en-github-actions)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Tags Disponibles](#-tags-disponibles)
- [Ambientes](#-ambientes)
- [Reportes](#-reportes)

---

## 🔧 Prerequisitos

- **Node.js** >= 18.x
- **npm** >= 9.x
- **Git**

### Verificar versiones:

```bash
node --version  # v20.x.x
npm --version   # 10.x.x
```

---

## 📦 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/TU-USUARIO/monnet-challenge.git
cd monnet-challenge
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Instalar navegadores de Playwright

```bash
npx playwright install chromium
```

---

## ⚙️ Configuración

### 1. Crear archivos de ambiente

Crea los archivos `.env.qa` y `.env.cert` en la raíz del proyecto:

```bash
# .env.qa
SECRET_KEY=7b5880f7-a781-4b39-9ceb-f8e3bfbce32d
```

```bash
# .env.cert
SECRET_KEY=8ca330f7-a781-4b39-9ceb-f8e3bf51366a
```

> ⚠️ **IMPORTANTE:** Estos archivos NO deben commitearse (ya están en `.gitignore`)

### 2. Verificar estructura de carpetas

El proyecto creará automáticamente la carpeta `images/` al ejecutar tests web.

---

## 🚀 Ejecución Local

### Ejecutar TODOS los tests

```bash
# Ambiente QA
npm run test:qa

# Ambiente CERT
npm run test:cert
```

### Ejecutar por tags específicos

```bash
# Solo tests de smoke en QA
npm run test:qa -- --grep "@smoke"

# Solo tests de Wikipedia
npm run test:qa -- --grep "@wiki"

# Múltiples tags (smoke O regression)
npm run test:qa -- --grep "@smoke|@regression"

# Tests de API de Pokémon
npm run test:qa -- --grep "@id|@name|@abilities"
```

### Ejecutar tests específicos por archivo

```bash
# Solo tests de API
npm run test:qa tests/api/

# Solo tests de posts
npm run test:qa tests/api/posts.spec.ts

# Solo tests de Wikipedia
npm run test:qa tests/web/wiki.spec.ts
```

### Modo UI (interfaz gráfica)

```bash
# Abre la UI de Playwright
npx playwright test --ui

# Ejecutar con navegador visible (headed mode)
npm run test:qa -- --headed
```

### Modo Debug

```bash
# Debug paso a paso
npx playwright test --debug

# Debug de un test específico
npx playwright test --debug --grep "@smoke"
```

---

## 🤖 Ejecución en GitHub Actions

### Ejecución Manual (Recomendado)

1. Ve a tu repositorio en GitHub
2. Click en la pestaña **Actions**
3. Selecciona **Playwright Tests** en el menú izquierdo
4. Click en **Run workflow** (botón verde a la derecha)
5. Selecciona las opciones:

```
┌─────────────────────────────────────────┐
│ Environment to test                     │
│ ● qa   ○ cert                          │
│                                         │
│ Test tags to run                        │
│ ● all                                   │
│   smoke                                 │
│   regression                            │
│   wiki                                  │
│   ...                                   │
└─────────────────────────────────────────┘
```

6. Click en **Run workflow**

### Ejecución Automática

El workflow se ejecuta automáticamente en:

- ✅ **Push** a la rama `main`
- ✅ **Pull Requests** hacia `main`

**Configuración por defecto:**
- Environment: `qa`
- Tags: `all`

---

## 📁 Estructura del Proyecto

```
monnet-challenge/
├── .github/
│   └── workflows/
│       └── playwright-tests.yml    # GitHub Actions workflow
├── data/
│   ├── Datos-pruebas.xlsx          # Datos de entrada (Pokémon)
│   └── xlsxReader.ts               # Lector de Excel
├── fixtures/
│   └── secret.fixture.ts           # Fixture para SECRET_KEY
├── pages/
│   └── WikiPokemonPage.ts          # Page Object Model para Wikipedia
├── tests/
│   ├── api/
│   │   ├── pokemon.spec.ts         # Tests de PokeAPI
│   │   └── posts.spec.ts           # Tests de JSONPlaceholder
│   └── web/
│       └── wiki.spec.ts            # Tests de Wikipedia
├── utils/
│   └── env.ts                      # Utilidad para variables de entorno
├── images/                         # Imágenes descargadas (auto-generado)
├── .env.qa                         # ⚠️ NO commitear
├── .env.cert                       # ⚠️ NO commitear
├── .gitignore
├── package.json
├── playwright.config.ts
└── README.md
```

---

## 🏷️ Tags Disponibles

### Tests de API

| Tag | Descripción | Archivo |
|-----|-------------|---------|
| `@smoke` | Tests críticos de humo | `posts.spec.ts` |
| `@regression` | Tests de regresión | `posts.spec.ts` |
| `@negative` | Tests de casos negativos | `posts.spec.ts` |
| `@performance` | Tests de performance | `posts.spec.ts` |
| `@id` | Búsqueda por ID | `pokemon.spec.ts` |
| `@name` | Búsqueda por nombre | `pokemon.spec.ts` |
| `@abilities` | Validación de habilidades | `pokemon.spec.ts` |

### Tests Web

| Tag | Descripción | Archivo |
|-----|-------------|---------|
| `@wiki` | Tests de Wikipedia | `wiki.spec.ts` |

### Ejemplos de uso:

```bash
# Un solo tag
npm run test:qa -- --grep "@smoke"

# Múltiples tags (OR)
npm run test:qa -- --grep "@smoke|@regression"
```

---

## 🌍 Ambientes

| Ambiente | Descripción | Secret Key |
|----------|-------------|------------|
| **QA** | Ambiente de testing | `7b5880f7-a781-4b39-9ceb-f8e3bfbce32d` |
| **CERT** | Ambiente de certificación | `8ca330f7-a781-4b39-9ceb-f8e3bf51366a` |

### Cambiar entre ambientes:

```bash
# QA
npm run test:qa -- --grep "@wiki"

# CERT
npm run test:cert -- --grep "@wiki"
```

---

## 📊 Reportes

### Ver reportes localmente

Después de ejecutar los tests:

```bash
# Abrir reporte HTML
npx playwright show-report
```

### Reportes en GitHub Actions

Los reportes se guardan como **artifacts** en cada ejecución:

1. Ve a **Actions** → Click en la ejecución
2. Baja hasta **Artifacts**
3. Descarga:
   - `playwright-report-{env}-{tags}` - Reporte HTML interactivo
   - `test-results-{env}-{tags}` - Screenshots y videos de fallos
   - `pokemon-images-{env}` - Imágenes descargadas

### Ver traces (debugging avanzado)

Si un test falla, descarga el `trace.zip` y ejecuta:

```bash
npx playwright show-trace trace.zip
```

Esto abre una UI interactiva con:
- ✅ Cada acción ejecutada
- ✅ Screenshots en cada paso
- ✅ Network requests
- ✅ Console logs
- ✅ DOM snapshots

---

## 🎯 Casos de Uso Comunes

### Desarrollo Local

```bash
# Ejecutar solo tus cambios web en QA
npm run test:qa -- --grep "@wiki"

# Ver el navegador mientras ejecuta
npm run test:qa -- --headed --grep "@wiki"

# Debug paso a paso
npx playwright test --debug --grep "@wiki"
```

### Pre-commit

```bash
# Ejecutar smoke tests antes de hacer commit
npm run test:qa -- --grep "@smoke"
```

### CI/CD

```bash
# En GitHub Actions (automático)
# - Push a main: corre todos los tests en QA
# - PR: corre todos los tests en QA
# - Manual: selecciona ambiente y tags
```

---

## 🐛 Troubleshooting

### Error: "Missing required environment variable: SECRET_KEY"

**Solución:** Verifica que existan los archivos `.env.qa` o `.env.cert` con la clave correcta.

```bash
# Verificar que existen
ls -la .env.*

# Verificar contenido
cat .env.qa
```

### Error: "Chromium not installed"

**Solución:** Instala los navegadores de Playwright

```bash
npx playwright install chromium
```

### Tests fallan en CI pero pasan en local

**Solución:** Verifica que los **GitHub Secrets** estén configurados:

1. Ve a **Settings** → **Secrets and variables** → **Actions**
2. Verifica que existan:
   - `SECRET_KEY_qa`
   - `SECRET_KEY_cert`

### Imágenes no se descargan

**Solución:** Verifica que la carpeta `images/` tenga permisos de escritura

```bash
mkdir -p images
chmod 755 images
```

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'feat: agregar nueva funcionalidad'`)
4. Push a la branch (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

## 📝 Notas Adicionales

### Datos de Prueba

Los datos de Pokémon se leen desde `data/Datos-pruebas.xlsx`:

| ID | Name |
|----|------|
| 1 | bulbasaur |
| 25 | pikachu |
| 143 | snorlax |

### Requisitos del Reto

✅ Leer archivo Excel con datos de prueba  
✅ Loguear clave secreta encriptada (SHA256)  
✅ Tests de API (PokeAPI y JSONPlaceholder)  
✅ Tests Web (Wikipedia)  
✅ Descargar imágenes interactuando con elementos web  
✅ Validar extensión de imagen (`.jpg`, `.jpeg`, `.png`, `.svg`)  
✅ Validar tamaño < 500KB  
✅ Loguear fecha/hora de finalización  
✅ Patrón Page Object Model  
✅ GitHub Actions CI/CD  

---

## 📄 Licencia

Este proyecto es parte del **Monnet Challenge**.

---

## 👥 Autor

**Tu Nombre** - [@tu-usuario](https://github.com/tu-usuario)

---

## 🔗 Links Útiles

- [Playwright Documentation](https://playwright.dev/)
- [PokeAPI](https://pokeapi.co/)
- [JSONPlaceholder](https://jsonplaceholder.typicode.com/)
- [GitHub Actions](https://docs.github.com/en/actions)