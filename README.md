## Ruta Auth

La ruta de **autenticación** maneja el registro, login, verificación de sesión y logout de los usuarios.  
Todos los endpoints usan **JWT en cookies** para manejar la sesión de forma segura. Por defecto, los usuarios registrados son **clientes** (rol id 1).

| Método | Ruta                | Descripción                                                                 |
|--------|-------------------|-----------------------------------------------------------------------------|
| POST   | /api/auth/register | Registra un nuevo usuario con rol **cliente** por defecto. Requiere `nombre`, `email` y `password`. Devuelve mensaje de éxito y `userId`. |
| POST   | /api/auth/login    | Valida `email` y `password`. Si son correctas, genera JWT y lo guarda en **cookie `token`** de 1 hora. Devuelve mensaje de login exitoso. |
| GET    | /api/auth/verify   | Verifica que la cookie `token` esté presente y sea válida. Devuelve la información del usuario contenida en el token. |
| POST   | /api/auth/logout   | Elimina la cookie `token`, cerrando la sesión del usuario. Devuelve mensaje de logout exitoso. |
