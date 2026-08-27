# Awesome-WebSite

Bu klasorde eski HTML/CSS/JS denemelerinden cikarilmis bir React component
kutuphanesi ve ayni componentleri gosteren bir Vite showcase uygulamasi var.

## Calistirma

```bash
npm install
npm run dev
```

Showcase: http://localhost:5173/

## Docker

Tek basina, baska servise bagli olmadan:

```bash
docker compose up -d --build
```

Showcase: http://localhost:4173/

## Build

```bash
npm run build
```

Demo build `dist/`, kutuphane build'i `dist-lib/` altina uretilir.

## Kutuphane kullanimi

```jsx
import { Fireworks, Campfire, RainScreen } from "mihrimatrix-awesome-components";

export function Demo() {
  return (
    <RainScreen
      height={420}
      density={1.15}
      speed={0.9}
      interactive
      showCity
    />
  );
}
```

CSS import etmeniz gerekmez; component stilleri JS tarafindan tek seferlik
olarak sayfaya eklenir. Stiller `.mxac-root` kutusu altinda scope edilir, bu
yuzden baska projelerdeki global class isimleriyle carpismasi hedeflenmez.
Isterseniz `componentStyles` ve `ensureComponentStyles()` export'lariyla ayni
stilleri manuel olarak da yonetebilirsiniz.

Tum componentler responsive container mantigiyla calisir; `height`,
`className` ve `style` props'lariyla baska sayfalara rahatca gomulebilir.
Sayfa genisligine degil, yerlestirildigi container genisligine uyacak sekilde
olceklenirler.

## Kontrol props'lari

Ortak props'lara ek olarak onemli komponentlerde davranis kontrol props'lari
vardir:

- `RainScreen`: `density`, `speed`, `interactive`, `showCity`, `paused`
- `Fireworks`: `particles`, `autoLaunch`, `interactive`, `burstSize`, `speed`, `paused`
- `Campfire`: `intensity`, `sparks`, `logs`, `paused`
- `RandomWords`: `words`, `duration`, `suffix`, `paused`
- `SlideClock`: `value`, `use24HourClock`, `showSeconds`
- `DigitalClock3D`: `value`, `use24HourClock`, `showSeconds`, `interactive`, `showNetwork`
- `RacingLines`: `rows`, `cols`

Showcase uygulamasi artik bir component lab olarak calisir: komponent secilir,
canli preview gorulur, import ornegi ve prop listesi ayni ekranda incelenir.

## Componentler

- `Fireworks` / `HavaiFisek`
- `Campfire` / `KampAtesi`
- `SlideClock` / `KapsamliDonerSaat`
- `DigitalClock3D` / `DigitalSaat3D`
- `LinesBeLining`
- `ParticleAttraction`
- `RacingLines`
- `RainbowLinesOfStraightness`
- `RainbowShinyComets`
- `RainbowSimpleMotionParticles`
- `RainbowTransfer`
- `RainbowGrid` / `SidenumChoserRainbowGrid`
- `RandomWords`
- `ColorRainLines` / `RenkliAkanCizgiler`
- `Starfield`
- `RainScreen` / `YagmurEkrani`
- `GravityParticles` / `YercekimliParcaciklar`
- `ChillLion` / `ChillTheLion`

## Paketleme

```bash
npm install
npm run build:lib
npm pack --dry-run
```

Paket ciktilari `dist-lib/` altina, TypeScript tipleri `types/` altina
hazirlanir. React, ReactDOM ve Three.js peer dependency olarak tanimlidir; bu
sayede kutuphane kullanilan uygulamanin kendi React kopyasini kullanir.
