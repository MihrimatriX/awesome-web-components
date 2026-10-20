# Awesome Components

Canvas, CSS ve Three.js ile yapılmış 18 animasyonlu React bileşeni. Hepsi eski
HTML/CSS/JS denemelerinden taşındı.

Canlı demo: https://mihrimatrix.github.io/awesome-web-components/

Demo sayfasında bir bileşen seçip prop'larını değiştirebilir, o ayarlarla
kullanım kodunu kopyalayabilirsiniz.

## Kendi projende kullanmak

Bu bir npm paketi değil. `src/components/` klasörünü projene kopyala; React ve
Three.js kurulu olmalı:

```bash
npm install react react-dom three
```

```jsx
import { RainScreen } from "./components";

export function Demo() {
  return <RainScreen height={420} density={1.15} speed={0.9} showCity />;
}
```

CSS import etmen gerekmez. Stiller ilk kullanımda sayfaya bir kez eklenir ve
`.mxac-root` altında kalır, böylece sitendeki class'larla çakışmaz.

Bileşenler sayfanın değil, içine konduğu kutunun genişliğine göre boyutlanır.
Hepsi `height`, `className` ve `style` alır. Ekrandan çıkan animasyon durur,
geri gelince devam eder; aynı sayfaya birkaç efekt koymak boşuna CPU harcamaz.

## Props

| Bileşen | Props |
| --- | --- |
| `RainScreen` | `density`, `speed`, `interactive`, `showCity`, `paused` |
| `Fireworks` | `particles`, `autoLaunch`, `interactive`, `burstSize`, `speed`, `paused` |
| `Campfire` | `intensity`, `sparks`, `logs`, `paused` |
| `RandomWords` | `words`, `duration`, `suffix`, `paused` |
| `SlideClock` | `value`, `use24HourClock`, `showSeconds` |
| `DigitalClock3D` | `value`, `use24HourClock`, `showSeconds`, `interactive`, `showNetwork` |
| `RacingLines` | `rows`, `cols`, `paused` |
| `ChillLion` | `showInstructions`, `paused` |

Diğer bileşenler (`Starfield`, `RainbowGrid`, `GravityParticles` ve
benzerleri) yalnızca `paused` alır.

## Geliştirme

```bash
npm install
npm run dev     # http://localhost:5173/
npm run build   # dist/
```

`main` dalına her push'ta site GitHub Pages'e yüklenir
(`.github/workflows/pages.yml`).
