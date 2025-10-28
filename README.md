## Ruta Auth

Rutas de autenticación usando **JWT en cookies**. Usuarios registrados son **clientes** por defecto (rol id 1).

| Método | Ruta              | Descripción                                                                 |
|--------|-----------------|-----------------------------------------------------------------------------|
| POST   | /api/auth/register | Registra un usuario con `nombre`, `email` y `password`. Devuelve `userId`. |
| POST   | /api/auth/login    | Valida `email` y `password`. Genera JWT en **cookie `token`**.       |
| GET    | /api/auth/profile | Retorna info del usuario logueado (`id`, `nombre`, `email`, `rol`).       |
| POST   | /api/auth/logout  | Elimina cookie `token`, cerrando sesión.                                   |

## Ruta User

Rutas de gestión de usuarios. **ADMINISTRADOR** puede manejar todos los usuarios; **PERSONAL** solo puede listar y ver usuarios con rol cliente; cualquier usuario puede actualizar o desactivarse a sí mismo usando `/me`.

| Método | Ruta                  | Descripción                                                                                     | Roles permitidos                  | Parámetros obligatorios                     | Parámetros opcionales                           |
|--------|----------------------|-------------------------------------------------------------------------------------------------|---------------------------------|-------------------------------------------|------------------------------------------------|
| POST   | /api/user            | Crea un nuevo usuario                                                                           | ADMINISTRADOR                   | nombre, email, password, id_rol           | telefono, direccion                            |
| GET    | /api/user            | Lista todos los usuarios, con filtros por nombre, activo y rol                                  | ADMINISTRADOR, PERSONAL         | —                                         | nombre, activo (true/false), rol             |
| GET    | /api/user/:id        | Obtiene un usuario por su ID                                                                    | ADMINISTRADOR, PERSONAL         | id                                        | —                                              |
| PUT    | /api/user/:id        | Actualiza un usuario existente                                                                 | ADMINISTRADOR                   | —                                         | nombre, email, telefono, direccion, activo, id_rol |
| DELETE | /api/user/:id        | Desactiva un usuario (borrado lógico: activo = false)                                          | ADMINISTRADOR                   | id                                        | —                                              |
| PUT    | /api/user/me         | Actualiza su propio perfil                                                                     | Todos los usuarios              | —                                         | nombre, email, telefono, direccion, password |
| DELETE | /api/user/me         | Se desactiva a sí mismo (borrado lógico: activo = false)                                       | Todos los usuarios              | —                                         | —                                              |
