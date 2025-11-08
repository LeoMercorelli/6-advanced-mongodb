# Backend III

Proyecto final de la cursada de Programación Backend III. Esta API gestiona usuarios, mascotas y procesos de adopción, e incluye módulos de mocking para poblar datos de prueba, documentación Swagger y una imagen oficial en Docker Hub.

## Autor
- **Nombre:** Leonel Mercorelli
- **Docker Hub:** (https://hub.docker.com/r/leomerco/adoptpme)


## Tecnologías principales
- Node.js 20
- Express
- MongoDB & Mongoose
- Swagger UI
- Mocha, Chai y Supertest
- Docker

## Requisitos previos
1. Node.js >= 20 y npm
2. MongoDB Atlas o un cluster MongoDB   accesible
3. Docker >= 24 (para ejecutar la imagen oficial)
4. Archivo `.env` con las variables necesarias:

```env
PORT=8080
MONGO_URL=mongodb+srv://<usuario>:<password>@<cluster>/<db>?retryWrites=true&w=majority
JWT_SECRET=supersecreto
COOKIE_SECRET=supersecreto
```

## Instalación y ejecución local
```bash
npm install
npm run dev
```
La aplicación queda disponible en `http://localhost:8080`.

## Documentación Swagger
Una vez levantado el servidor, accedé a la documentación en `http://localhost:8080/api/docs`.

## Mocking API
El router `/api/mocks` provee datos ficticios sin afectar la base real:
- `GET /api/mocks/mockingpets?count=100` genera el número deseado de mascotas.
- `GET /api/mocks/mockingusers?count=50` genera usuarios mock con contraseñas encriptadas.
- `POST /api/mocks/generateData` inserta en MongoDB la cantidad solicitada de usuarios y mascotas.

## Tests funcionales
Los endpoints de `adoption.router.js` están cubiertos por pruebas con Mocha.

```bash
npm test
```

# Construir la imagen Docker localmente
docker build -t adoptme-local .

# Ejecutar la imagen local en un nuevo contenedor
docker run --rm -it --name adoptme2 \
  -e MONGO_URI='mongodb+srv://leonel:Coder123@server-basic.pcevw3m.mongodb.net/?appName=server-basic' \
  -e PORT=8080 \
  -p 8082:8080 \
  adoptme-local
```

```
## Estructura de carpetas destacada
```
src/
├── routes/              # Routers de la API (users, pets, adoptions, mocks, etc.)
├── controllers/         # Lógica de negocio por recurso
├── services/            # Servicios y capa de acceso a datos
├── mocks/               # Generadores de datos ficticios
├── docs/                # Esquemas Swagger
├── test/                # Tests funcionales (Mocha + Chai + Supertest)
└── utils/               # Utilidades (logger, helpers, etc.)
```