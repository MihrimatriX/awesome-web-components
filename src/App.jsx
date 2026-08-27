import { useEffect, useMemo, useState } from "react";
import { showcaseItems } from "./showcaseItems.jsx";

const ALL_TYPES = "Tümü";
const DEFAULT_SELECTED = "rain-screen";
const PACKAGE_NAME = "mihrimatrix-awesome-components";
const INSTALL_SNIPPET = `npm i ${PACKAGE_NAME}`;

const commonPropDocs = [
  [
    "height",
    "number | string",
    "bileşene göre",
    "Kök kutunun yüksekliği. Sayı piksel, string CSS değeri olarak kullanılır.",
  ],
  [
    "className",
    "string",
    "—",
    "Kapsüllü kök elemana ek class. Stiller .mxac-root altında kalır.",
  ],
  [
    "style",
    "CSSProperties",
    "—",
    "Kök elemana inline stil ve CSS değişkeni geçirmek için.",
  ],
];

const componentPropDocs = {
  fireworks: [
    ["particles", "number", "100", "Aynı anda sahnede durabilecek parçacık tavanı."],
    ["autoLaunch", "boolean", "true", "Kullanıcı tıklamadan otomatik patlama başlatır."],
    ["interactive", "boolean", "true", "Tıklama / dokunmayla patlama açar."],
    ["burstSize", "number", "1", "Her patlamada üretilen parçacık sayısı."],
    ["speed", "number", "1", "Animasyon hız çarpanı (0–3)."],
    ["paused", "boolean", "false", "Güncellemeleri dondurur."],
  ],
  campfire: [
    ["intensity", "number", "1", "Alev boyutu ve hızını ölçekler."],
    ["sparks", "boolean", "true", "Uçuşan kıvılcımları gösterir."],
    ["logs", "boolean", "true", "Odun yığınını gösterir."],
    ["paused", "boolean", "false", "CSS alev / kıvılcım hareketini durdurur."],
  ],
  "slide-clock": [
    ["value", "Date | string | number", "şimdi", "Kontrollü saat değeri. Verilmezse canlı akar."],
    ["use24HourClock", "boolean", "true", "24 saat / 12 saat biçimi."],
    ["showSeconds", "boolean", "true", "Saniye hanesini gösterir."],
  ],
  "digital-clock-3d": [
    ["value", "Date | string | number", "şimdi", "Kontrollü saat değeri. Verilmezse canlı akar."],
    ["use24HourClock", "boolean", "true", "24 saat / 12 saat biçimi."],
    ["showSeconds", "boolean", "true", "Saniye hanesini gösterir."],
    ["interactive", "boolean", "true", "Fareyle 3D eğilmeyi açar."],
    ["showNetwork", "boolean", "true", "Arka plandaki ağ animasyonunu gösterir."],
  ],
  "random-words": [
    ["words", "string[]", "dahili liste", "Sırayla gösterilecek kelimeler."],
    ["duration", "number", "2000", "Her kelimenin animasyon süresi (ms)."],
    ["suffix", "string", '"!"', "Her kelimenin sonuna eklenen metin."],
    ["paused", "boolean", "false", "Kelime animasyonunu duraklatır."],
  ],
  "racing-lines": [
    ["rows", "number", "14", "Yatay çizgi satırı sayısı."],
    ["cols", "number", "18", "Dikey çizgi sütunu sayısı."],
  ],
  "rain-screen": [
    ["density", "number", "1", "Damla, iz ve boncuk miktarı."],
    ["speed", "number", "1", "Yağmur ve damla hareket hızı."],
    ["interactive", "boolean", "true", "İmleç yakındaki damlaları iter."],
    ["showCity", "boolean", "true", "Şehir silüetini gösterir."],
    ["paused", "boolean", "false", "Animasyonu dondurur."],
  ],
};

const previewPropsBySlug = {
  fireworks: { particles: 130, burstSize: 3, speed: 1.08 },
  campfire: { intensity: 1.08, sparks: true, logs: true },
  "slide-clock": { showSeconds: true },
  "digital-clock-3d": { showSeconds: true, showNetwork: true },
  "random-words": {
    words: ["awesome", "react", "motion", "library", "spark"],
    duration: 1800,
  },
  "rain-screen": { density: 1.08, speed: 0.9, showCity: true },
};

function slugFromLocation() {
  const slug = window.location.hash.replace(/^#/, "");
  return showcaseItems.some((item) => item.slug === slug)
    ? slug
    : DEFAULT_SELECTED;
}

function formatValue(value) {
  if (typeof value === "string") return `"${value}"`;
  if (typeof value === "boolean") return value ? "true" : "false";
  if (Array.isArray(value)) return JSON.stringify(value);
  return String(value);
}

function usageSnippet(item, props) {
  const propLines = Object.entries(props)
    .map(([key, value]) => `  ${key}={${formatValue(value)}}`)
    .join("\n");

  return propLines
    ? `<${item.exportName}\n${propLines}\n/>`
    : `<${item.exportName} />`;
}

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button type="button" className="copy-btn" onClick={copy}>
      {copied ? "Kopyalandı" : "Kopyala"}
    </button>
  );
}

function ComponentButton({ item, selected, onSelect }) {
  return (
    <button
      type="button"
      className={`catalog-item${selected ? " is-active" : ""}`}
      onClick={() => onSelect(item.slug)}
      aria-current={selected ? "true" : undefined}
    >
      <span className="catalog-item-title">
        <strong>{item.title}</strong>
        <em>{item.type}</em>
      </span>
      <small>{item.description}</small>
    </button>
  );
}

function PropTable({ item }) {
  const extra = componentPropDocs[item.slug] ?? [];
  const rows = [...commonPropDocs, ...extra];

  return (
    <div className="prop-wrap">
      {extra.length === 0 ? (
        <p className="prop-note">
          Bu bileşenin özel kontrolü yok. Yüksekliği, class ve inline stil ile
          yerleştirilir.
        </p>
      ) : null}
      <table className="prop-table">
        <thead>
          <tr>
            <th>Prop</th>
            <th>Tip</th>
            <th>Varsayılan</th>
            <th>Ne işe yarar</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([name, type, fallback, description]) => (
            <tr key={name}>
              <th scope="row">
                <code>{name}</code>
              </th>
              <td>
                <span className="type-pill">{type}</span>
              </td>
              <td>{fallback}</td>
              <td>{description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function App() {
  const [query, setQuery] = useState("");
  const [activeType, setActiveType] = useState(ALL_TYPES);
  const [selectedSlug, setSelectedSlug] = useState(slugFromLocation);

  const typeFilters = useMemo(
    () => [
      ALL_TYPES,
      ...Array.from(new Set(showcaseItems.map((item) => item.type))),
    ],
    [],
  );

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return showcaseItems.filter((item) => {
      const matchesType = activeType === ALL_TYPES || item.type === activeType;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [item.title, item.original, item.exportName, item.type, item.description]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesType && matchesQuery;
    });
  }, [activeType, query]);

  const selectedItem =
    showcaseItems.find((item) => item.slug === selectedSlug) ??
    showcaseItems[0];
  const SelectedPreview = selectedItem.Component;
  const selectedPreviewProps = previewPropsBySlug[selectedItem.slug] ?? {};
  const selectedImport = `import { ${selectedItem.exportName} } from "${PACKAGE_NAME}";`;
  const selectedUsage = usageSnippet(selectedItem, selectedPreviewProps);

  useEffect(() => {
    const next = `#${selectedItem.slug}`;
    if (window.location.hash !== next) {
      window.history.replaceState(null, "", next);
    }

    const active = document.querySelector(".catalog-item.is-active");
    const list = document.querySelector(".catalog-list");
    if (!active || !list) return;

    const itemBox = active.getBoundingClientRect();
    const listBox = list.getBoundingClientRect();
    if (itemBox.top < listBox.top) {
      list.scrollTop -= listBox.top - itemBox.top;
    } else if (itemBox.bottom > listBox.bottom) {
      list.scrollTop += itemBox.bottom - listBox.bottom;
    }
  }, [selectedItem.slug]);

  useEffect(() => {
    const onHash = () => setSelectedSlug(slugFromLocation());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    document.title = `${selectedItem.title} · Awesome Components`;
    const description =
      selectedItem.description ??
      "Gömülebilir React görsel bileşenler. Canlı önizle, props oku, kodu kopyala.";
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", description);
  }, [selectedItem.description, selectedItem.title]);

  const selectComponent = (slug) => {
    setSelectedSlug(slug);
    if (window.matchMedia("(max-width: 900px)").matches) {
      document
        .getElementById("preview")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const surpriseMe = () => {
    const pool = filteredItems.length > 0 ? filteredItems : showcaseItems;
    const next = pool[Math.floor(Math.random() * pool.length)];
    selectComponent(next.slug);
  };

  return (
    <div className="app-shell">
      <header className="top-bar">
        <a
          className="brand-mark"
          href={`#${DEFAULT_SELECTED}`}
          onClick={(event) => {
            event.preventDefault();
            selectComponent(DEFAULT_SELECTED);
          }}
        >
          <strong>MX</strong>
          <span>
            Awesome Components
            <small>React görsel bileşen kütüphanesi</small>
          </span>
        </a>
        <div className="top-tools">
          <code className="install-chip">
            {INSTALL_SNIPPET}
            <CopyButton value={INSTALL_SNIPPET} />
          </code>
          <a
            className="ghost-link"
            href="https://github.com/MihrimatriX/Awesome-WebSite"
          >
            Kaynak
          </a>
        </div>
      </header>

      <main className="library-main">
        <section className="hero-panel">
          <h1>Seç, izle, yerleştir.</h1>
          <p>
            {showcaseItems.length} gömülebilir React görsel bileşen. Soldan
            birini seç; ne işe yaradığını oku, canlı izle, import kodunu
            kopyala. CSS import gerekmez — stiller kapsüllenir ve yerleştirildiği
            kutu genişliğine uyum sağlar.
          </p>
        </section>

        <section className="component-lab" aria-label="Bileşen laboratuvarı">
          <aside className="catalog-panel">
            <div className="panel-head">
              <h2>Katalog</h2>
              <span>
                {filteredItems.length} / {showcaseItems.length}
              </span>
            </div>
            <label className="search-field">
              <span>Bileşen ara</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="İsim, export veya açıklama"
              />
            </label>
            <div className="type-filter" role="tablist" aria-label="Teknik tür">
              {typeFilters.map((type) => (
                <button
                  className={activeType === type ? "is-active" : ""}
                  type="button"
                  role="tab"
                  aria-selected={activeType === type}
                  onClick={() => setActiveType(type)}
                  key={type}
                >
                  {type}
                </button>
              ))}
            </div>
            <div className="catalog-list">
              {filteredItems.map((item) => (
                <ComponentButton
                  item={item}
                  selected={item.slug === selectedItem.slug}
                  onSelect={selectComponent}
                  key={item.slug}
                />
              ))}
              {filteredItems.length === 0 ? (
                <div className="empty-state">
                  <strong>Eşleşen bileşen yok</strong>
                  <span>Aramayı veya tür filtresini değiştirin.</span>
                </div>
              ) : null}
            </div>
          </aside>

          <div className="stage">
            <section className="preview-workbench" id="preview">
              <div className="workbench-head">
                <div>
                  <p>
                    {selectedItem.original}
                    <span>{selectedItem.type}</span>
                  </p>
                  <h2>{selectedItem.title}</h2>
                </div>
                <button type="button" className="text-btn" onClick={surpriseMe}>
                  Rastgele
                </button>
              </div>
              <p className="item-copy">{selectedItem.description}</p>
              {selectedItem.hint ? (
                <p className="item-hint">{selectedItem.hint}</p>
              ) : (
                <p className="item-hint">Önizleme otomatik oynar.</p>
              )}
              <div className="live-preview">
                <SelectedPreview
                  height="clamp(260px, 36vw, 400px)"
                  {...selectedPreviewProps}
                />
              </div>
            </section>

            <section className="details-panel" aria-label="Kullanım">
              <div className="usage-grid">
                <div className="code-block">
                  <div className="code-block-head">
                    <span>Import</span>
                    <CopyButton value={selectedImport} />
                  </div>
                  <code>{selectedImport}</code>
                </div>
                <div className="code-block">
                  <div className="code-block-head">
                    <span>Önizleme ile aynı kullanım</span>
                    <CopyButton value={selectedUsage} />
                  </div>
                  <code>{selectedUsage}</code>
                </div>
              </div>
              <div className="panel-head prop-head">
                <h2>Props</h2>
                <span>
                  {(componentPropDocs[selectedItem.slug]?.length ?? 0) +
                    commonPropDocs.length}{" "}
                  alan
                </span>
              </div>
              <PropTable item={selectedItem} />
            </section>
          </div>
        </section>
      </main>
    </div>
  );
}
