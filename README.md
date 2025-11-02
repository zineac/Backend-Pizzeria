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


## 👥 Rutas de Usuarios (`/api/usuario`)

Rutas de gestión de usuarios.  
- **ADMINISTRADOR** puede crear, actualizar, eliminar y listar todos los usuarios.  
- **PERSONAL** solo puede listar y ver usuarios con rol **cliente**.  
- Cualquier usuario autenticado puede actualizar o desactivar su propio perfil mediante `/me`.

| Método | Endpoint                  | Descripción                                                                                           | Roles Permitidos                | Parámetros Obligatorios                         | Parámetros Opcionales                                      |
|:--------|:--------------------------|:------------------------------------------------------------------------------------------------------|:--------------------------------|:------------------------------------------------|:------------------------------------------------------------|
| **POST** | `/api/usuario`           | Crea un nuevo usuario.                                                                                | `ADMINISTRADOR`                 | `nombre`, `email`, `password`, `id_rol`         | `telefono`, `direccion`                                    |
| **GET**  | `/api/usuario`           | Lista todos los usuarios. Admite filtros.                                                             | `ADMINISTRADOR`, `PERSONAL`     | —                                              | `nombre`, `activo` (`true/false`), `rol`                   |
| **GET**  | `/api/usuario/:id`       | Obtiene los datos de un usuario por su `id`.                                                          | `ADMINISTRADOR`, `PERSONAL`     | `id`                                           | —                                                          |
| **PUT**  | `/api/usuario/:id`       | Actualiza los datos de un usuario existente.                                                          | `ADMINISTRADOR`                 | —                                              | `nombre`, `email`, `telefono`, `direccion`, `activo`, `id_rol` |
| **DELETE** | `/api/usuario/:id`     | Desactiva un usuario (borrado lógico: `activo = false`).                                              | `ADMINISTRADOR`                 | `id`                                           | —                                                          |
| **PUT**  | `/api/usuario/me`        | Actualiza el perfil del usuario autenticado.                                                          | `Todos los usuarios`            | —                                              | `nombre`, `email`, `telefono`, `direccion`, `password`      |
| **DELETE** | `/api/usuario/me`      | Desactiva la cuenta del usuario autenticado (borrado lógico: `activo = false`).                       | `Todos los usuarios`            | —                                              | —                                                          |

> **Notas:**
> - Los parámetros opcionales pueden enviarse parcialmente para actualizar solo los campos deseados.  
> - El campo `activo` es de tipo booleano (`true`/`false`).  
> - Los filtros en `GET /api/usuario` se envían como **query params** (ejemplo: `/api/usuario?nombre=Juan&activo=true`).


## 🌿 Rutas de Ingredientes (`/api/ingrediente`)

Rutas para gestionar los **ingredientes** disponibles en la pizzería.  
- **ADMINISTRADOR** puede crear, actualizar, eliminar y ver todos los ingredientes.  
- **PERSONAL** puede listar y actualizar ingredientes activos o inactivos.  
- **CLIENTE** y **REPARTIDOR** solo pueden ver ingredientes activos.  

| Método | Endpoint | Descripción | Roles Permitidos | Parámetros Obligatorios | Parámetros Opcionales |
|:--------|:----------|:-------------|:------------------|:------------------------|:----------------------|
| **GET** | `/api/ingrediente` | Lista todos los ingredientes. Los administradores y el personal pueden filtrar por estado (`activo`). | `ADMINISTRADOR`, `PERSONAL`, `CLIENTE`, `REPARTIDOR` | — | `nombre`, `activo` (`true`/`false`) |
| **GET** | `/api/ingrediente/:id` | Obtiene un ingrediente por su `id`. Los clientes solo pueden acceder a ingredientes activos. | `ADMINISTRADOR`, `PERSONAL`, `CLIENTE`, `REPARTIDOR` | `id` | — |
| **POST** | `/api/ingrediente` | Crea un nuevo ingrediente. | `ADMINISTRADOR` | `nombre` | `costo_extra`, `stock`, `activo` |
| **PUT** | `/api/ingrediente/:id` | Actualiza un ingrediente existente. | `ADMINISTRADOR`, `PERSONAL` | `id` | `nombre`, `costo_extra`, `stock`, `activo` |
| **DELETE** | `/api/ingrediente/:id` | Desactiva un ingrediente (borrado lógico: `activo = false`). | `ADMINISTRADOR` | `id` | — |

> **Notas:**
> - `costo_extra` es un valor decimal que indica el costo adicional del ingrediente (por ejemplo, toppings extras).  
> - `stock` representa la cantidad disponible del ingrediente en inventario.  
> - El campo `activo` indica si el ingrediente está disponible para usar en productos.  
> - Los filtros (`nombre`, `activo`) se envían como **query params**:  
>   - Ejemplo: `/api/ingrediente?nombre=queso&activo=true`.
