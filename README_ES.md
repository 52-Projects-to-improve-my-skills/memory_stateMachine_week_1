# 🎯 Memory State Machine

**Lee en English:** `README.md`  
**Tipo de proyecto:** JavaScript (Node.js) — Semana 1

---

## Resumen ejecutivo

Aplicación de consola que implementa una máquina de estados finita (FSM) para capturar y persistir notas cortas ("memorias") desde la terminal. El diseño modela explícitamente estados y transiciones (IDLE, LISTENING, MEMORIZING, ERROR), garantizando que la aplicación solo ejecute transiciones válidas y que exista un flujo claro de recuperación frente a fallos.

Pertenece a la serie "52 Projects" (Semana 1) y demuestra diseño orientado a estados, separación de responsabilidades y patrones robustos de persistencia para herramientas CLI interactivas.

---

## Inicio rápido

Requisitos:
- Node.js v14+

Ejecutar:
```bash
# desde la raíz del proyecto
npm install      # opcional si hay dependencias
node main.js
```

Controles interactivos:
- `Ctrl+S` — iniciar captura de entrada (entrar en LISTENING)
- Escribir texto — se agrega al buffer
- `Enter` — nueva línea
- `Backspace` — borrar carácter
- `Ctrl+D` — finalizar y tratar de guardar (entrar en MEMORIZING)
- `Ctrl+X` — cancelar entrada y volver a IDLE
- `Ctrl+R` — en ERROR, reintentar guardar
- `Ctrl+C` — salir de la aplicación

Al iniciar, la aplicación muestra un pequeño bloque de ayuda y espera `Ctrl+S` para comenzar.

---

## Qué enseña este proyecto

- Modelar programas con FSM (estados, eventos, transiciones)
- Diseñar transiciones explícitas y testeables
- Persistencia básica de archivos y recuperación ante errores
- Organización de una pequeña app CLI con responsabilidades claras

---

## Arquitectura (alto nivel)

Responsabilidades principales:
- StateManager: mantener estado actual y validar transiciones
- States: encapsulan enter/handle/exit por estado
- InputHandler: capturar y normalizar entrada de terminal
- Storage: persistir en `memories.json`, registrar errores en `error_log.json`

Datos escritos:
- `memories.json` — arreglo de objetos memoria:
```json
[
  {
    "id": 1678890000000,
    "content": "Mi primera memoria",
    "timestamp": "2024-03-25T12:34:56.789Z"
  }
]
```
- `error_log.json` — arreglo de objetos de error con `id`, `timestamp`, `error`, `stack`, `attemptedContent`.

---

## Resumen de la FSM

Estados: `IDLE`, `LISTENING`, `MEMORIZING`, `ERROR`.  
Transiciones clave:
- `IDLE` —(Ctrl+S)→ `LISTENING`: empezar captura
- `LISTENING` —(Ctrl+D)→ `MEMORIZING`: intentar guardar contenido
- `MEMORIZING` —(success)→ `IDLE`: guardado correcto
- `MEMORIZING` —(error)→ `ERROR`: fallo en guardado (se registra)
- `ERROR` —(Ctrl+R)→ `MEMORIZING`: reintentar guardado
- `LISTENING` —(Ctrl+X)→ `IDLE`: cancelar entrada
- `ERROR` —(Ctrl+X)→ `IDLE`: cancelar y descartar

Las transiciones explícitas evitan estados inválidos y hacen el comportamiento predecible.

---

## Solución de problemas

- Programa no responde: ejecutar en una terminal real (TTY), no en la consola integrada del IDE; Node >= 14.
- Error al escribir archivos: comprobar permisos de escritura, espacio en disco y validez de `memories.json`/`error_log.json`.
- Pérdida del comportamiento raw: añadir handlers de señales para restaurar `process.stdin.setRawMode(false)` al salir.

---

## Limitaciones y mejoras sugeridas

- La E/S puede ser síncrona; migrar a `fs.promises` y escrituras atómicas.
- Añadir handlers de señales para restaurar el estado TTY en salidas abruptas.
- Implementar comandos para listar/leer/eliminar memorias y añadir pruebas unitarias.
- Reescribir a TypeScript para tipado más robusto.
- Portar a Rust para practicar FSM con enums y ownership.

---

## Reflexión (Semana 1)

- Construir esto aclara que una FSM es más que condicionales: los estados encapsulan comportamiento y las transiciones son constructos principales.
- Parte difícil: manejo de entrada raw en Node. Solución: `readline` y buena gestión del TTY.
- Próximos pasos técnicos: escrituras atómicas, TypeScript y tests.

---

## Autor y licencia

- Autor: Carlos Enrique Cochero Ramos — GitHub: @caertos  
- Licencia: MIT — ver `LICENSE`
