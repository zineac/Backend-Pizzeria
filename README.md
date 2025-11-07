## 🧩 Rutas de Autenticación (`/api/auth`)

Rutas para **registro, inicio y cierre de sesión**, usando **JWT almacenado en cookies**.  
Los usuarios registrados se crean automáticamente con el rol **CLIENTE (`id_rol = 1`)**.  

| Método | Endpoint              | Descripción                                                                                              | Roles Permitidos | Parámetros Obligatorios       | Parámetros Opcionales |
|:--------|:----------------------|:---------------------------------------------------------------------------------------------------------|:----------------|:-----------------------------|:--------------------|
| **POST** | `/api/auth/register` | Registra un nuevo usuario con `nombre`, `email` y `password`. Retorna el `userId`.                       | Público         | `nombre`, `email`, `password` | — |
| **POST** | `/api/auth/login`    | Inicia sesión validando `email` y `password`. Genera un **JWT** almacenado en la cookie `token`.         | Público         | `email`, `password`          | — |
| **GET**  | `/api/auth/profile`  | Devuelve la información del usuario autenticado (`id`, `nombre`, `email`, `rol`).                        | Todos los usuarios autenticados | — | — |
| **POST** | `/api/auth/logout`   | Cierra la sesión eliminando la cookie `token`.                                                           | Todos los usuarios autenticados | — | — |

> **Notas:**
> - Excepto `/register` y `/login`, todas las rutas requieren autenticación mediante la cookie `token`.  
> - El registro automático asigna el rol **CLIENTE** a todos los nuevos usuarios.  
> - El JWT se envía en la **cookie `token`**, por lo que las demás rutas protegidas deben leer esta cookie para validar al usuario.


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


## 🎭 Rutas de Roles (`/api/rol`)

Rutas para gestionar los **roles** disponibles en el sistema.  
- Todas las rutas son **solo accesibles para ADMINISTRADOR**.  
- Los roles se usan principalmente para asignar permisos a los usuarios.  

| Método | Endpoint | Descripción | Roles Permitidos | Parámetros Obligatorios | Parámetros Opcionales |
|:--------|:----------|:-------------|:------------------|:------------------------|:----------------------|
| **GET** | `/api/rol` | Lista todos los roles disponibles. | `ADMINISTRADOR` | — | — |
| **GET** | `/api/rol/:id` | Obtiene los datos de un rol específico por su ID. | `ADMINISTRADOR` | `id` | — |
| **POST** | `/api/rol` | Crea un nuevo rol en el sistema. | `ADMINISTRADOR` | `nombre` | — |
| **PUT** | `/api/rol/:id` | Actualiza un rol existente (nombre y/o estado). | `ADMINISTRADOR` | `id` | `nombre`, `activo` (`true/false`) |
| **DELETE** | `/api/rol/:id` | Desactiva un rol (borrado lógico: `activo = false`). | `ADMINISTRADOR` | `id` | — |

> **Notas:**
> - El campo `nombre` es obligatorio para crear un nuevo rol.  
> - Todas las rutas requieren autenticación mediante **JWT** y verificación de rol `ADMINISTRADOR`.  
> - El `DELETE` ahora realiza un **borrado lógico**, marcando el rol como inactivo en lugar de eliminarlo físicamente.  
> - No hay rutas públicas para roles, ya que solo los administradores necesitan gestionarlos.


## 🗂️ Rutas de Categorías de Producto (`/api/categoria`)

Rutas para la gestión de las **categorías** de productos en el sistema.  
Cada categoría puede estar activa o inactiva.  

- **ADMINISTRADOR** tiene acceso total (crear, actualizar, eliminar, ver activas e inactivas).  
- **PERSONAL** puede listar y ver categorías activas e inactivas.  
- **CLIENTE** y **REPARTIDOR** solo pueden ver categorías activas.  

| Método | Endpoint | Descripción | Roles Permitidos | Parámetros Obligatorios | Parámetros Opcionales |
|:--------|:----------|:-------------|:------------------|:------------------------|:----------------------|
| **GET** | `/api/categoria` | Lista todas las categorías disponibles. | `ADMINISTRADOR`, `PERSONAL`, `CLIENTE`, `REPARTIDOR` | — | `nombre`, `activo` (`true/false`) |
| **GET** | `/api/categoria/:id` | Obtiene los datos de una categoría específica. | `ADMINISTRADOR`, `PERSONAL`, `CLIENTE`, `REPARTIDOR` | `id` | — |
| **POST** | `/api/categoria` | Crea una nueva categoría. | `ADMINISTRADOR` | `nombre` | `descripcion` |
| **PUT** | `/api/categoria/:id` | Actualiza la información de una categoría existente. | `ADMINISTRADOR` | `id` | `nombre`, `descripcion`, `activo` (`true/false`) |
| **DELETE** | `/api/categoria/:id` | Desactiva una categoría (borrado lógico: `activo = false`). | `ADMINISTRADOR` | `id` | — |

> ### **Notas:**
> - Las **categorías inactivas (`activo = false`)** no son visibles para `CLIENTE` ni `REPARTIDOR`.  
> - El **borrado lógico** evita eliminar categorías del historial de productos, simplemente se marca como inactiva.  
> - Los filtros en `GET /api/categoria` se envían como **query params**, por ejemplo: `/api/categoria?nombre=pizza&activo=true`.  
> - Cada categoría puede tener una **descripción** opcional que detalla su contenido o tipo de productos asociados.


## 📏 Rutas de Tamaños (`/api/tamano`)

Rutas para la gestión de los **tamaños de los productos** (por ejemplo, *Pequeña*, *Mediana*, *Grande*).  
Cada tamaño tiene un **factor de precio** que multiplica el valor base del producto y puede estar **activo o inactivo**.  

- **ADMINISTRADOR** tiene acceso total (crear, actualizar, eliminar, ver activos e inactivos).  
- **PERSONAL** puede listar y ver tamaños activos e inactivos.  
- **CLIENTE** y **REPARTIDOR** solo pueden ver tamaños activos.  

| Método | Endpoint | Descripción | Roles Permitidos | Parámetros Obligatorios | Parámetros Opcionales |
|:--------|:----------|:-------------|:------------------|:------------------------|:----------------------|
| **GET** | `/api/tamano` | Lista todos los tamaños disponibles. | `ADMINISTRADOR`, `PERSONAL`, `CLIENTE`, `REPARTIDOR` | — | `nombre`, `activo` (`true/false`) |
| **GET** | `/api/tamano/:id` | Obtiene los datos de un tamaño específico. | `ADMINISTRADOR`, `PERSONAL`, `CLIENTE`, `REPARTIDOR` | `id` | — |
| **POST** | `/api/tamano` | Crea un nuevo tamaño. | `ADMINISTRADOR` | `nombre`, `factor_precio` | `activo` (`true/false`) |
| **PUT** | `/api/tamano/:id` | Actualiza la información de un tamaño existente. | `ADMINISTRADOR` | `id` | `nombre`, `factor_precio`, `activo` (`true/false`) |
| **DELETE** | `/api/tamano/:id` | Desactiva un tamaño (borrado lógico: `activo = false`). | `ADMINISTRADOR` | `id` | — |

> ### **Notas:**
> - Los **tamaños inactivos (`activo = false`)** no son visibles para `CLIENTE` ni `REPARTIDOR`.  
> - El **campo `factor_precio`** es un multiplicador decimal que ajusta el precio base del producto según el tamaño.  
> - El **borrado lógico** evita eliminar tamaños del historial de pedidos; simplemente se marca como inactivo.  
> - Los filtros en `GET /api/tamano` se envían como **query params**, por ejemplo: `/api/tamano?nombre=Mediana&activo=true`.


## 🍕 Rutas de Productos (`/api/producto`)

Rutas para la gestión de los **productos** del sistema (por ejemplo, pizzas, bebidas o postres).  
Cada producto pertenece a una **categoría** y puede estar marcado como **personalizable**, lo que permite agregar o quitar ingredientes al momento de armar el pedido.

- **ADMINISTRADOR** tiene acceso total (crear, actualizar, eliminar, ver activos e inactivos).  
- **PERSONAL** puede listar, ver y actualizar productos activos e inactivos.  
- **CLIENTE** y **REPARTIDOR** solo pueden ver productos activos.  

| Método | Endpoint | Descripción | Roles Permitidos | Parámetros Obligatorios | Parámetros Opcionales |
|:--------|:----------|:-------------|:------------------|:------------------------|:----------------------|
| **GET** | `/api/producto` | Lista todos los productos disponibles. | `ADMINISTRADOR`, `PERSONAL`, `CLIENTE`, `REPARTIDOR` | — | `nombre`, `activo` (`true/false`), `id_categoria`, `personalizable` (`true/false`) |
| **GET** | `/api/producto/:id` | Obtiene los datos de un producto específico (incluye su categoría). | `ADMINISTRADOR`, `PERSONAL`, `CLIENTE`, `REPARTIDOR` | `id` | — |
| **POST** | `/api/producto` | Crea un nuevo producto en el sistema. | `ADMINISTRADOR` | `nombre`, `precio`, `id_categoria` | `descripcion`, `personalizable` (`true/false`), `activo` (`true/false`) |
| **PUT** | `/api/producto/:id` | Actualiza la información de un producto existente. | `ADMINISTRADOR`, `PERSONAL` | `id` | `nombre`, `descripcion`, `precio`, `id_categoria`, `personalizable`, `activo` |
| **DELETE** | `/api/producto/:id` | Desactiva un producto (borrado lógico: `activo = false`). | `ADMINISTRADOR` | `id` | — |
| **GET** | `/api/producto/:id/ingrediente` | Lista los ingredientes asociados a un producto. | `ADMINISTRADOR`, `PERSONAL`, `CLIENTE`, `REPARTIDOR` | `id` | — |
| **POST** | `/api/producto/:id/ingrediente` | Agrega varios ingredientes a un producto existente. | `ADMINISTRADOR`, `PERSONAL` | `id`, `ingredientes` (array de IDs) | — |
| **DELETE** | `/api/producto/:id/ingrediente/:idIng` | Elimina un ingrediente específico de un producto. | `ADMINISTRADOR`, `PERSONAL` | `id`, `idIng` | — |

> ### **Notas:**
> - Los **productos inactivos (`activo = false`)** no son visibles para `CLIENTE` ni `REPARTIDOR`.  
> - El **campo `personalizable`** indica si el cliente puede modificar sus ingredientes al realizar un pedido.  
> - El **borrado lógico** evita eliminar productos del historial: simplemente se marca como inactivo.  
> - Los filtros en `GET /api/producto` se envían como **query params**, por ejemplo: `/api/producto?nombre=pizza&id_categoria=1&personalizable=true&activo=true`.  
> - Las relaciones entre productos e ingredientes se gestionan mediante las rutas `/api/producto/:id/ingrediente`, que permiten **listar**, **agregar** o **eliminar** ingredientes vinculados a un producto.  
> - Cada producto está asociado a una **categoría** mediante el campo `id_categoria`.  


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


## 💳 Rutas de Métodos de Pago (`/api/pago`)

Rutas para gestionar los **métodos de pago** disponibles en el sistema.  
- **ADMINISTRADOR** puede crear, actualizar, desactivar y listar todos los métodos.  
- **PERSONAL** puede ver métodos activos e inactivos.  
- **CLIENTE** y **REPARTIDOR** solo pueden ver los métodos activos.  
- Se utiliza **borrado lógico** mediante el campo `activo`.

| Método | Endpoint | Descripción | Roles Permitidos | Parámetros Obligatorios | Parámetros Opcionales |
|:--------|:----------|:-------------|:------------------|:------------------------|:----------------------|
| **GET** | `/api/pago` | Lista todos los métodos de pago disponibles. | `ADMINISTRADOR`, `PERSONAL`, `CLIENTE`, `REPARTIDOR` | — | `tipo`, `activo` (`true/false`) |
| **GET** | `/api/pago/:id` | Obtiene los datos de un método de pago específico. | `ADMINISTRADOR`, `PERSONAL`, `CLIENTE`, `REPARTIDOR` | `id` | — |
| **POST** | `/api/pago` | Crea un nuevo método de pago. | `ADMINISTRADOR` | `tipo` | `descripcion` |
| **PUT** | `/api/pago/:id` | Actualiza la información de un método de pago existente. | `ADMINISTRADOR` | `id` | `tipo`, `descripcion`, `activo` (`true/false`) |
| **DELETE** | `/api/pago/:id` | Desactiva un método de pago (borrado lógico). | `ADMINISTRADOR` | `id` | — |

> **Notas:**
> - Los métodos de pago inactivos no estarán disponibles para selección en nuevos pedidos.  
> - Los pedidos históricos mantienen el método asociado incluso si este fue desactivado.  
> - El campo `activo` permite controlar la disponibilidad sin eliminar datos del sistema.  
> - Los filtros (`tipo`, `activo`) se envían como **query params**, por ejemplo:  
>   `/api/pago?tipo=pasarela&activo=true`.


## 🚦 Rutas de Estados de Pedido (`/api/estado`)

Rutas para gestionar los **estados de los pedidos** del sistema.  
Cada pedido posee un estado que indica su progreso (por ejemplo: *Pendiente*, *En preparación*, *En reparto*, *Entregado*, etc.).

- **ADMINISTRADOR** puede crear, actualizar, desactivar y listar todos los estados.
- **PERSONAL** puede listar todos los estados (activos e inactivos).
- **CLIENTE** y **REPARTIDOR** solo pueden ver los estados activos (no modificarlos).

| Método | Endpoint | Descripción | Roles Permitidos | Parámetros Obligatorios | Parámetros Opcionales |
|:--------|:----------|:-------------|:------------------|:------------------------|:----------------------|
| **GET** | `/api/estado` | Lista todos los estados de pedido disponibles. | `ADMINISTRADOR`, `PERSONAL`, `CLIENTE`, `REPARTIDOR` | — | `nombre`, `activo` (`true/false`) |
| **GET** | `/api/estado/:id` | Obtiene los datos de un estado específico. | `ADMINISTRADOR`, `PERSONAL`, `CLIENTE`, `REPARTIDOR` | `id` | — |
| **POST** | `/api/estado` | Crea un nuevo estado de pedido. | `ADMINISTRADOR` | `nombre` | — |
| **PUT** | `/api/estado/:id` | Actualiza los datos de un estado existente. | `ADMINISTRADOR` | `id` | `nombre`, `activo` (`true/false`) |
| **DELETE** | `/api/estado/:id` | Desactiva un estado (borrado lógico: `activo = false`). | `ADMINISTRADOR` | `id` | — |

> **Notas:**
> - El campo `activo` indica si el estado puede ser asignado a nuevos pedidos.
> - Los estados inactivos se mantienen en la base de datos para preservar el historial de pedidos previos.
> - Los filtros (`nombre`, `activo`) se envían como **query params**, por ejemplo:  
>   `/api/estado?nombre=pendiente&activo=true`.


## 🍽️ Rutas de Pedidos (`/api/pedido`)

Rutas para gestionar los **pedidos** del sistema.  
Cada pedido está compuesto por un **cliente**, un **método de pago**, y una lista de **detalles** (productos con cantidad, tamaño y posibles personalizaciones).  

- **ADMINISTRADOR** tiene acceso total (crear, actualizar, eliminar, ver todos los pedidos).  
- **PERSONAL** puede crear y actualizar pedidos, así como ver todos los pedidos activos e inactivos.  
- **REPARTIDOR** solo puede ver y actualizar los pedidos **asignados a él**.  
- **CLIENTE** solo puede ver y crear sus **propios pedidos activos**.  

Los pedidos incluyen detalles y personalizaciones:
- Cada **detalle** contiene un producto y su cantidad.  
- La **personalización** puede incluir el tamaño (`id_tamano`) y una lista de ingredientes adicionales o removidos.  
- El **borrado lógico** marca un pedido como inactivo sin eliminarlo del historial.  

| Método | Endpoint | Descripción | Roles Permitidos | Parámetros Obligatorios | Parámetros Opcionales |
|:--------|:---------|:------------|:-----------------|:-----------------------|:--------------------|
| **GET** | `/api/pedido` | Lista todos los pedidos. CLIENTE ve solo los suyos, REPARTIDOR solo los asignados. | `ADMINISTRADOR`, `PERSONAL`, `REPARTIDOR`, `CLIENTE` | — | — |
| **GET** | `/api/pedido/:id` | Obtiene un pedido específico. CLIENTE solo puede acceder a sus pedidos. | `ADMINISTRADOR`, `PERSONAL`, `REPARTIDOR`, `CLIENTE` | `id` | — |
| **POST** | `/api/pedido` | Crea un nuevo pedido con sus detalles y personalizaciones. | `ADMINISTRADOR`, `PERSONAL`, `CLIENTE` | `id_cliente`, `id_metodo_pago`, `detalles[]` | `id_repartidor` |
| **PUT** | `/api/pedido/:id/estado` | Actualiza el estado de un pedido (por ejemplo: Pendiente, En preparación, Entregado). | `ADMINISTRADOR`, `PERSONAL`, `REPARTIDOR` | `id` | `id_estado` |
| **DELETE** | `/api/pedido/:id` | Desactiva un pedido (borrado lógico: `activo = false`). | `ADMINISTRADOR` | `id` | — |

> ### **Notas**
> - Los pedidos inactivos (`activo = false`) no deben ser visibles para CLIENTE ni REPARTIDOR.
> - La creación de pedidos permite enviar detalles con productos, cantidades, tamaños y personalizaciones de ingredientes.
> - Para GET `/api/pedido`, los roles CLIENTE y REPARTIDOR deben filtrar automáticamente los pedidos según su relación.
> - El borrado lógico evita eliminar registros históricos del sistema; simplemente se marca como inactivo.
