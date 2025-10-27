## Ruta Auth

Rutas de autenticación usando **JWT en cookies**. Usuarios registrados son **clientes** por defecto (rol id 1).

| Método | Ruta              | Descripción                                                                 |
|--------|-----------------|-----------------------------------------------------------------------------|
| POST   | /api/auth/register | Registra un usuario con `nombre`, `email` y `password`. Devuelve `userId`. |
| POST   | /api/auth/login    | Valida `email` y `password`. Genera JWT en **cookie `token`**.       |
| GET    | /api/auth/profile | Retorna info del usuario logueado (`id`, `nombre`, `email`, `rol`).       |
| POST   | /api/auth/logout  | Elimina cookie `token`, cerrando sesión.                                   |
