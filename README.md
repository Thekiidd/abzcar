# Casa Simpson 3D Interactiva

Proyecto web en **Three.js** que recrea una versión estilizada de la casa de los Simpson en 3D, con:

- Escena completa (casa, garaje, valla, árboles, calle y jardín).
- Animaciones (puerta principal, auto en movimiento, nubes y luz solar dinámica).
- Navegación interactiva con cámara.

## Ejecutar localmente

Como es un proyecto estático, puedes levantarlo con cualquier servidor web:

```bash
python3 -m http.server 4173
```

Luego abre:

```text
http://localhost:4173
```

## Controles

- **Clic en "Entrar en modo primera persona" o clic en la escena**: activa navegación FPS
- **W / A / S / D**: caminar
- **Mouse**: mirar alrededor
- **Shift (izq/der)**: correr
- **ESC**: salir del modo FPS


## Despliegue en Vercel

Este repo ya incluye `vercel.json`, así que puedes desplegarlo como sitio estático.

### Opción A: desde dashboard (recomendada)
1. Sube este repo a GitHub.
2. Entra en [Vercel](https://vercel.com/new).
3. Importa el repositorio.
4. Framework preset: **Other** (o sin framework).
5. Build command: **vacío**.
6. Output directory: **.**
7. Deploy.

### Opción B: con CLI
```bash
npm i -g vercel
vercel login
vercel --prod
```

## Nota
Intenté desplegar automáticamente desde este entorno, pero falló por token inválido y restricciones de red saliente hacia la API de Vercel.


## Flujo recomendado de ramas + Vercel

Para evitar que producción publique una rama equivocada, usa este flujo:

- `main`: **producción** (deploy productivo en Vercel).
- `work` o `feature/*`: **preview** (pruebas y desarrollo).

### Pasar cambios de `work` a `main`

#### Opción 1 (recomendada): Pull Request en GitHub
1. `git push -u origin work`
2. Crear PR: `work` -> `main`
3. Revisar y hacer merge
4. Vercel redeploya producción al detectar el push en `main`

#### Opción 2: merge local
```bash
git checkout main
git pull origin main
git merge --no-ff work
git push origin main
```

## Configuración correcta en Vercel

En **Project Settings -> Git**:

- **Production Branch**: `main`
- Las demás ramas (`work`, `feature/*`) quedarán como **Preview Deployments** automáticamente.

## Checklist rápido de validación

1. En GitHub, último commit de `main` contiene tus cambios.
2. En Vercel, el deploy de **Production** apunta a `main`.
3. El deploy de `work` aparece como **Preview** (no producción).
4. Si cambiaste la rama de producción, usa **Redeploy** una vez para sincronizar.
