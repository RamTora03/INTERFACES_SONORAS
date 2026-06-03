# Daft Punk DJ Desk - Mesa de Mezclas Interactiva

Mesa de mezclas y consola de DJ interactiva inspirada en la mítica estética retro-futurista de **Daft Punk** (representando los icónicos cascos de Thomas Bangalter y Guy-Manuel de Homem-Christo). Desarrollada con **React 18**, **TypeScript**, **Vite** y **Tailwind CSS**, hace uso avanzado de la API de **Web Audio** para ofrecer un entorno interactivo de mezcla, scratching rítmico, ecualización y procesamiento de efectos en tiempo real.

---

## 🛠️ Estructura y Orden del Proyecto `(/src)`

El código se organiza siguiendo estrictos principios de separación de responsabilidades y modularidad en React, impidiendo archivos monolíticos masivos:

```bash
├── index.html                  # Plantilla de entrada con metadatos estructurados y favicon SVG dinámico
├── package.json                # Declaración de dependencias del ecosistema Vite + React + Lucide
├── src/
│   ├── main.tsx                # Punto de entrada de la aplicación para el renderizado del DOM
│   ├── App.tsx                 # Contenedor Cockpit principal con el flujo de inicio e interfaz global
│   ├── audioEngine.ts          # Núcleo técnico (Web Audio API) con sintetizadores, filtros y deks
│   ├── types.ts                # Interfaces fuertemente tipadas compartidas del dominio DJ
│   ├── index.css               # Importaciones de Tailwind CSS, fuentes neon y temas customizados
│   └── components/
│       ├── Turntable.tsx       # Módulos de Platina (A & B) para Scratching interactivo y controles de Play/Cue
│       ├── Mixer.tsx           # Consola de Mezcla Central (Crossfader, Master Gain, Ecualización tri-banda)
│       └── EffectsPanel.tsx    # Panel de Efectos X/Y y atenuación de ganancia o resonancia del filtro
```

---

## 🎹 Funcionalidades y Requisitos Técnicos Cubiertos

### 1. HTML Semántico y Estructurado
* **Estructura jerárquica**: Uso estricto de etiquetas semánticas (`<header>`, `<main>`, `<section>`, `<footer>`, `<canvas>`) asegurando una correcta interpretación del documento.
* **Metadatos y Favicon**: Archivo `index.html` actualizado con descripción detallada en español, viewport adaptativo y un favicon SVG codificado en línea que muestra un disco de vinilo retroiluminado con luces de neón cian/rosa.

### 2. CSS Funcional, Organización y Diseño Coherente
* **Grid Tridimensional Simétrico**: Se ha reestructurado la rejilla principal a `12 columnas` para que el diseño se vea imponente y perfectamente balanceado en pantalla completa (`col-span-4` para Deck A, `col-span-4` para Mezclador central y `col-span-4` para Deck B), eliminando el panel de botones excesivos que congestionaban la proporción vertical.
* **Consistencia Estética (Neon Noir)**: Paleta de color oscura profunda (`#050505`) con toques neón cian (`#00f3ff`) y magenta (`#ff00ff`) simulando luces de cabina realistas.
* **Cascos CSS 3D**: Representación minimalista realista de los cascos de Daft Punk con visores animados que pulsan rítmicamente en respuesta visual.

### 3. JavaScript Interactivo y Audio Web (Sintetizador en Tiempo Real)
* **Web Audio API**: La consola no produce ruido pregrabado plano; cada nota musical virtualizada de éxitos como *Around the World*, *Robot Rock* y *Get Lucky* es sintetizada mediante osciladores matemáticos (`OscillatorNode`) que pasan por envolventes de volumen de decaimiento exponencial (`GainNode`) sincronizados rítmicamente.
* **Transmisión de Audio Real (Discovery Fallback)**: Además del sintetizador integrado por matriz de notas, los controles de las platinas permiten cargar streams directos desde la biblioteca pública de Archive.org para reproducir los archivos de audio oficiales en alta fidelidad y jugar con filtros de corte sobre la música real de Daft Punk.
* **Lógica Estable y Concurrente**: Los estados y nodos suspenden o reanudan sus hilos de audio de manera segura para evitar picos de hardware o desbordamiento de memoria de audio en el navegador del usuario al hacer clic repetidamente.

### 4. Responsividad y Adaptabilidad a Pantalla Completa
* **Golden Ratio Canvas Sizing**: El lienzo interactivo del plato giratorio (`<canvas>`) calcula sus dimensiones mediante un observador de cambios dinámico, escalando su altura empleando la proporción del ancho físico disponible en pantalla completa, manteniendo un aspecto estético nítido y libre de deformaciones.
* **Fader y Controles Adaptativos**: Los controles deslizantes ajustan su capacidad del ancho adaptable a pantallas 4K y pantallas de portátiles sin apilar los sliders.

---

## 🎛️ Guía del Panel de Control de Audio

1. **Encender Mesa DJ**: Haz clic en el botón inicial para activar internamente el contexto de audio del navegador (`AudioContext`).
2. **Carga y Platina (Turntables A & B)**: 
   * **Cargar Pista**: Elige entre las representaciones sintetizadas o los streams reales de *Discovery*.
   * **Play / Pause**: Detén y reanuda el motor sin perder el tempo rítmico.
   * **Scratch FX**: Haz clic y arrastra con el cursor o el dedo sobre el disco de vinilo en movimiento para distorsionar la velocidad rítmica, alterando la frecuencia y provocando el clásico efecto de scratching.
3. **Consola de Mezclas**:
   * **Master Volume**: Controla el volumen absoluto del rack.
   * **Crossfader**: Desplaza progresivamente la señal acústica hacia la izquierda (Deck A) o hacia la derecha (Deck B) usando curvas realistas de amplitud constante.
   * **EQ Tri-Banda**: Aplica ganancias de filtrado en agudos (Hi), medios (Mid) y graves (Low) mediante filtros de estantería (`BiquadFilterNode`).
4. **Frecuencias de Efectos**: 
   * Configura la intensidad de modulación de corte de frecuencia baja/alta sobre cada Deck de forma independiente utilizando las alfombrillas táctiles reactivas.




