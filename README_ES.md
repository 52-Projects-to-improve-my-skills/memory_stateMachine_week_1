# 🎯 Memory State Machine

**Lee en English:** README.md  
**Tipo de proyecto:** JavaScript (Node.js) — Semana 1

---

1. Objetivo

Construir una aplicación CLI que capture, persista y gestione notas cortas ("memorias") desde la terminal usando una máquina de estados finita (FSM). El énfasis está en modelar estados y transiciones explícitas (IDLE, LISTENING, MEMORIZING, ERROR) y en patrones básicos de persistencia y recuperación ante errores.

2. Qué debes lograr (checklist)

- [ ] Ejecutar `node main.js` en una terminal real (TTY) y ver el bloque de ayuda inicial.
- [ ] Iniciar captura con `Ctrl+S`, escribir texto y finalizar con `Ctrl+D`; una nueva entrada se añade a `memories.json`.
- [ ] Cancelar captura con `Ctrl+X` y verificar que no se creó ninguna memoria.
- [ ] Simular un error de escritura (p. ej. permisos de sistema de archivos) y comprobar que `error_log.json` contiene el registro del fallo.
- [ ] Salir con `Ctrl+C` y evitar dejar la terminal en modo raw (si se implementan handlers de salida).

3. Conocimientos necesarios

- Node.js y `readline` para entrada por terminal.
- Operaciones de archivos y JSON en Node (`fs`).
- Máquinas de estado finitas: estados, transiciones y acciones permitidas.
- Conceptos de TTY y modo raw.

4. Inicio rápido

Requisitos:
- Node.js v16+

Ejecutar:
```bash
# desde la raíz del proyecto (no hay dependencias externas por defecto)
node main.js
```

Nota: `npm install` no es necesario a menos que añadas dependencias o `package.json`.

Controles interactivos principales:
- `Ctrl+S` — empezar captura (LISTENING)
- Escribir — añadir al buffer
- `Enter` — nueva línea
- `Backspace` — borrar carácter
- `Ctrl+D` — terminar y guardar (MEMORIZING)
- `Ctrl+X` — cancelar y volver a IDLE
- `Ctrl+R` — reintentar guardado en ERROR
- `Ctrl+C` — salir

5. Casos de uso

- Tomar notas rápidas desde la terminal.
- Aprender y experimentar con FSMs en aplicaciones reales.
- Base para una bitácora sencilla con persistencia JSON.

6. Alcance (qué entra / qué no entra)

Incluye:
- FSM y persistencia local en `memories.json`.
- Log básico de errores en `error_log.json`.

No incluye (esta semana):
- Interfaz gráfica o sincronización remota.
- Tests automáticos integrados.

7. Usos futuros

- Añadir comandos CRUD para memorias.
- Migrar el almacenamiento a `fs.promises` y escrituras atómicas.
- Reescribir a TypeScript o portar a Rust.

8. Ideas de escalado

1. Extraer un adaptador de almacenamiento y ofrecer implementaciones JSON/SQLite/remota.
2. Añadir indexado y búsqueda en las memorias.
3. Ejecutar como servicio (daemon) exponiendo una API local.

9. Pistas arquitectónicas

- Modularizar responsabilidades: `stateManager`, `states`, `inputHandler`, `storage`.
- Mantener transiciones y acciones explícitas por estado.
- Logear errores con metadatos: `stack`, `attemptedContent`, `timestamp`.

10. Solución de problemas

- Ejecutar en una terminal TTY real; algunas consolas integradas no soportan modo raw.
- Revisar permisos y validez de los archivos JSON (`memories.json`, `error_log.json`).

11. Limitaciones y mejoras sugeridas

- La E/S actual usa llamadas síncronas de `fs` que pueden bloquear el event loop; migrar a promesas y escrituras atómicas.
- Añadir handlers para `exit`, `SIGINT` y `uncaughtException` para restaurar el TTY en salidas abruptas.

12. Reflexión (Semana 1)

- La FSM clarifica rutas de fallo y recuperación, reduciendo la complejidad incidental.
- Reto: manejo de entrada raw en Node y restauración segura del TTY.

13. Autor & licencia

- Autor: Carlos Enrique Cochero Ramos — GitHub: @caertos  
- Licencia: MIT — ver `LICENSE`
