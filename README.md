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

- **W / A / S / D**: mover cámara
- **Q / E**: subir / bajar cámara
- **Mouse (arrastrar)**: orbitar
- **Rueda**: zoom


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
