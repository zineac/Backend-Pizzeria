## 🧩 Rutas de Autenticación (`/api/auth`)

Rutas para registro, inicio y cierre de sesión, usando **JWT almacenado en cookies**.  
Los usuarios registrados se crean automáticamente con el rol **CLIENTE (`id_rol = 1`)**.

| Método | Endpoint              | Descripción                                                                                              |
|:--------|:----------------------|:---------------------------------------------------------------------------------------------------------|
| **POST** | `/api/auth/register` | Registra un nuevo usuario con `nombre`, `email` y `password`. Retorna el `userId`.                       |
| **POST** | `/api/auth/login`    | Inicia sesión validando `email` y `password`. Genera un **JWT** almacenado en la cookie `token`.         |
| **GET**  | `/api/auth/profile`  | Devuelve la información del usuario autenticado (`id`, `nombre`, `email`, `rol`).                        |
| **POST** | `/api/auth/logout`   | Cierra la sesión eliminando la cookie `token`.                                                           |

> **Nota:** Excepto `/register` y `/login`, todas las rutas requieren autenticación mediante la cookie `token`.


## 👥 Rutas de Usuarios (`/api/user`)

Rutas de gestión de usuarios.  
- **ADMINISTRADOR** puede crear, actualizar, eliminar y listar todos los usuarios.  
- **PERSONAL** solo puede listar y ver usuarios con rol **cliente**.  
- Cualquier usuario autenticado puede actualizar o desactivar su propio perfil mediante `/me`.

| Método | Endpoint              | Descripción                                                                                           | Roles Permitidos                | Parámetros Obligatorios                         | Parámetros Opcionales                                      |
|:--------|:----------------------|:------------------------------------------------------------------------------------------------------|:--------------------------------|:------------------------------------------------|:------------------------------------------------------------|
| **POST** | `/api/user`          | Crea un nuevo usuario.                                                                                | `ADMINISTRADOR`                 | `nombre`, `email`, `password`, `id_rol`         | `telefono`, `direccion`                                    |
| **GET**  | `/api/user`          | Lista todos los usuarios. Admite filtros.                                                             | `ADMINISTRADOR`, `PERSONAL`     | —                                              | `nombre`, `activo` (`true/false`), `rol`                   |
| **GET**  | `/api/user/:id`      | Obtiene los datos de un usuario por su `id`.                                                          | `ADMINISTRADOR`, `PERSONAL`     | `id`                                           | —                                                          |
| **PUT**  | `/api/user/:id`      | Actualiza los datos de un usuario existente.                                                          | `ADMINISTRADOR`                 | —                                              | `nombre`, `email`, `telefono`, `direccion`, `activo`, `id_rol` |
| **DELETE** | `/api/user/:id`    | Desactiva un usuario (borrado lógico: `activo = false`).                                              | `ADMINISTRADOR`                 | `id`                                           | —                                                          |
| **PUT**  | `/api/user/me`       | Actualiza el perfil del usuario autenticado.                                                          | `Todos los usuarios`            | —                                              | `nombre`, `email`, `telefono`, `direccion`, `password`      |
| **DELETE** | `/api/user/me`     | Desactiva la cuenta del usuario autenticado (borrado lógico: `activo = false`).                       | `Todos los usuarios`            | —                                              | —                                                          |

> **Notas:**
> - Los parámetros opcionales pueden enviarse parcialmente para actualizar solo los campos deseados.  
> - El campo `activo` es de tipo booleano (`true`/`false`).  
> - Los filtros en `GET /api/user` se envían como **query params** (ejemplo: `/api/user?nombre=Juan&activo=true`).
