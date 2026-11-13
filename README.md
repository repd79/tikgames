# TikGamesX
Feed vertical de minijuegos al estilo TikTok. **Al abrir la página ya está jugando** un juego, y el feed es **infinito**:
cuando pierdes, tras una cuenta atrás de 3 s pasa solo al siguiente juego (toca la pantalla para reintentar el mismo),
y al llegar al último vuelve a empezar. También puedes deslizar a mano, y ♥ guarda favoritos.

80 juegos. El orden es aleatorio en cada visita y **nunca van dos juegos seguidos con la misma estética**.
Abre `index.html` (mejor servido: `python3 -m http.server`). `index.html?g=ID` arranca por un juego concreto (p. ej. `?g=wave`).

## Añadir juegos
Nuevo archivo en `js/games/`, `def({...})` y su `<script>` en `index.html`. Campos nuevos respecto a los juegos originales:
- `style`: familia visual (`gameboy`, `1bit`, `paper`, `riso`…). El orden del feed las intercala.
- `skin`: aspecto del HUD y de la pantalla de fin. `dark` (por defecto), `light` (texto oscuro, para fondos claros), `flat` (sombras duras, sin brillos). Se pueden combinar: `'light flat'`.
`js/style.js` tiene utilidades para dar estilo: sprites de píxel (`ST.spr`), tramado 1-bit (`ST.dither`), medios tonos (`ST.halftone`), scanlines CRT (`ST.scan`), grano de papel, sombra de papel recortado, dígitos de 7 segmentos…

## Juegos nuevos (21) y su estética
| Estética | Juegos |
|---|---|
| Game Boy (4 verdes) | Serpiente |
| 1 bit, Mac clásico | Cactus Run, Detector |
| Terminal de fósforo verde | Mazmorra ASCII |
| Papel recortado | Papel y Tijera, Globo |
| Plano técnico (blueprint) | Circuito |
| Pergamino a tinta | Catapulta |
| Periódico / imprenta | El Intruso |
| Cómic con medios tonos | Tiro al Plato |
| Vectorial (fósforo) | Vector Core, Túnel |
| Risografía a dos tintas | 3 en Raya, Deslíza |
| Diseño suizo, plano | Penaltis |
| Pastel menta | Minigolf |
| Madera pintada | Torre de Hanói |
| LCD de bolsillo (7 segmentos) | Rescate LCD |
| CGA (4 colores) | Marcianos |
| Memphis pop | Balancín |
| Estampa japonesa (ukiyo-e) | Ola Grande |

## Pack 8 bits (7) — `js/games/g14.js`
Cada uno con la paleta de un ordenador o consola de los 80: Ladrillos (Amstrad CPC), Bombas (Atari 2600), Pong 64 (Commodore 64), Bloques ZX (ZX Spectrum), Saltitos (NES), Escuadrón (Master System) y Rata Queso (laberinto arcade).

## Mesa y lógica (4) — `js/games/g15.js`
Conecta 4 y Reversi contra la máquina (la IA sube de nivel con cada victoria), Cajas (sokoban infinito con niveles generados y siempre resolubles) y Nonograma (puzles con solución garantizada). Los dos puzles tienen cuenta atrás y dan tiempo extra al resolver.

## Juegos incrustados (6) — `js/games/g13.js` y carpeta `ext/`
Juegos hechos aparte que se cargan en un `iframe` dentro del feed (`embed:` en `def`): Palabros (solo el modo de palabras), Nexo, Gatodoku (solo el modo de tableros, niveles al azar), Dojo Gamberro, Shobu Sumo y Laserinto.
Cada tarjeta tiene un botón «siguiente» y una franja a cada lado para deslizar el feed. Las copias de `ext/` están adaptadas (sin menús ni enlaces de vuelta); los originales viven en la carpeta `games` de Raúl.

## Iconos y créditos
- Interfaz: iconos de línea de [Lucide](https://lucide.dev) (licencia ISC), uno por juego, en `js/icons.js`.
- Sprites de los juegos antiguos (animales, comida…): ilustraciones de [Twemoji](https://github.com/jdecked/twemoji) (gráficos CC-BY 4.0), copiadas en `js/tw/` para que se vean igual en cualquier móvil.
