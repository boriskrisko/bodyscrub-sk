import { useState, useEffect } from "react";

const products = [
  { id: 1, name: "Coffee scrub", desc: "Energizujúci kávový peeling", price: 18.90, tag: "BESTSELLER", category: "coffee", weight: "200g", color: "#8B7355" },
  { id: 2, name: "Lavender oil scrub", desc: "Upokojujúci levanduľový rituál", price: 22.90, tag: "NOVINKA", category: "oil", weight: "150g", color: "#6B4D7A" },
  { id: 3, name: "Matcha detox", desc: "Antioxidačný matcha peeling", price: 24.90, tag: "ORGANIC", category: "matcha", weight: "180g", color: "#4A6741" },
  { id: 4, name: "Himalayan salt scrub", desc: "Minerálny soľný peeling", price: 19.90, tag: "VEGAN", category: "salt", weight: "220g", color: "#C4A97D" },
  { id: 5, name: "Coconut & vanilla", desc: "Hydratačný kokosový peeling", price: 21.90, tag: "HANDMADE", category: "oil", weight: "200g", color: "#8B7355" },
  { id: 6, name: "Charcoal deep clean", desc: "Detoxikačný aktívne uhlie", price: 23.90, tag: "NOVINKA", category: "charcoal", weight: "180g", color: "#1C1C1C" },
];

const reviews = [
  { name: "Katarína M.", text: "Kávový scrub je úžasný! Pleť je hladká a vonia ako čerstvé espresso.", rating: 5 },
  { name: "Tomáš R.", text: "Konečne niečo prírodné čo naozaj funguje. Matcha detox je môj favorit.", rating: 5 },
  { name: "Zuzana K.", text: "Levanduľový scrub pred spaním = najlepší večerný rituál.", rating: 5 },
];

const Star = ({ filled }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? "#C4A97D" : "none"} stroke="#C4A97D" strokeWidth="2">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);

const LeafIcon = ({ size = 20, color = "#4A6741" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round">
    <path d="M12 22c0 0 8-4 8-12C20 4 14 2 12 2c-2 0-8 2-8 8 0 8 8 12 8 12z"/>
    <path d="M12 22V8"/>
    <path d="M8 14c2-2 4-3 4-3"/>
    <path d="M16 11c-2 1.5-4 3-4 3"/>
  </svg>
);

const ScrubCircle = ({ color, size = 120, label }) => {
  const dots = Array.from({ length: 18 }, (_, i) => {
    const a = (i / 18) * Math.PI * 2;
    const r = size * 0.32 + Math.random() * size * 0.08;
    return { x: Math.cos(a) * r + size/2, y: Math.sin(a) * r + size/2, s: 2 + Math.random() * 3 };
  });
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={size*0.38} fill={color} opacity="0.15"/>
        <circle cx={size/2} cy={size/2} r={size*0.28} fill={color} opacity="0.25"/>
        {dots.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={d.s} fill={color} opacity="0.4"/>)}
      </svg>
      {label && <span style={{ position:"absolute", bottom: -8, left:"50%", transform:"translateX(-50%)", fontSize:10, letterSpacing:2, color, fontWeight:500, whiteSpace:"nowrap" }}>{label}</span>}
    </div>
  );
};

export default function Homepage() {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const addToCart = (p) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === p.id);
      if (existing) return prev.map(i => i.id === p.id ? {...i, qty: i.qty + 1} : i);
      return [...prev, { ...p, qty: 1 }];
    });
    setShowCart(true);
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const filtered = filter === "all" ? products : products.filter(p => p.category === filter);
  const categories = [
    { key: "all", label: "Všetky" },
    { key: "coffee", label: "Kávové" },
    { key: "oil", label: "Olejové" },
    { key: "matcha", label: "Matcha" },
    { key: "salt", label: "Soľné" },
    { key: "charcoal", label: "Charcoal" },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', 'Outfit', system-ui, sans-serif", color: "#1C1C1C", background: "#FAF7F2", minHeight: "100vh", overflow: "hidden" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&family=Outfit:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: #4A6741; color: #F5F0E8; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes float { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-8px); } }
        @keyframes grain { 0% { transform:translate(0,0); } 10% { transform:translate(-2%,-2%); } 20% { transform:translate(1%,1%); } 30% { transform:translate(-1%,3%); } 40% { transform:translate(3%,-1%); } 50% { transform:translate(-2%,2%); } 60% { transform:translate(1%,-3%); } 70% { transform:translate(-3%,1%); } 80% { transform:translate(2%,2%); } 90% { transform:translate(-1%,-1%); } 100% { transform:translate(0,0); } }
        .fade-up { animation: fadeUp 0.7s ease-out both; }
        .fade-up-2 { animation: fadeUp 0.7s 0.15s ease-out both; }
        .fade-up-3 { animation: fadeUp 0.7s 0.3s ease-out both; }
        .float { animation: float 4s ease-in-out infinite; }
        .product-card { transition: transform 0.3s, box-shadow 0.3s; cursor: pointer; }
        .product-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.08); }
        .btn-primary { background: #4A6741; color: #F5F0E8; border: none; padding: 12px 28px; border-radius: 50px; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.3s; letter-spacing: 0.5px; }
        .btn-primary:hover { background: #3A5333; transform: scale(1.02); }
        .btn-outline { background: transparent; color: #1C1C1C; border: 1px solid #D3CABC; padding: 10px 24px; border-radius: 50px; font-size: 13px; cursor: pointer; transition: all 0.3s; }
        .btn-outline:hover { border-color: #4A6741; color: #4A6741; }
        .tag { display: inline-block; padding: 3px 10px; border-radius: 50px; font-size: 9px; letter-spacing: 1.5px; font-weight: 500; }
        .filter-btn { padding: 8px 20px; border-radius: 50px; border: 1px solid #E8DCC8; background: transparent; font-size: 13px; cursor: pointer; transition: all 0.25s; color: #8B7355; }
        .filter-btn.active { background: #4A6741; color: #F5F0E8; border-color: #4A6741; }
        .filter-btn:hover:not(.active) { border-color: #4A6741; color: #4A6741; }
      `}</style>

      {/* Grain overlay */}
      <div style={{ position:"fixed", top:0, left:0, right:0, bottom:0, pointerEvents:"none", zIndex:999, opacity:0.03, background:"url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')" }} />

      {/* Navbar */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "rgba(250,247,242,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(211,202,188,0.4)" : "none",
        padding: "16px 32px",
        transition: "all 0.3s",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <LeafIcon size={22} />
          <span style={{ fontFamily: "Outfit", fontWeight: 500, fontSize: 18, letterSpacing: 1 }}>bodyscrub</span>
          <span style={{ fontFamily: "Outfit", fontWeight: 500, fontSize: 18, color: "#4A6741" }}>.sk</span>
        </div>
        <div style={{ display: "flex", gap: 32, alignItems: "center", fontSize: 14, color: "#5C4A30" }}>
          <span style={{ cursor: "pointer" }}>Produkty</span>
          <span style={{ cursor: "pointer" }}>O nás</span>
          <span style={{ cursor: "pointer" }}>Blog</span>
          <div onClick={() => setShowCart(!showCart)} style={{ cursor: "pointer", position: "relative" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1C1C1C" strokeWidth="1.5" strokeLinecap="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {cartCount > 0 && (
              <span style={{ position:"absolute", top:-6, right:-8, background:"#4A6741", color:"#fff", fontSize:10, width:18, height:18, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:500 }}>{cartCount}</span>
            )}
          </div>
        </div>
      </nav>

      {/* Cart drawer */}
      {showCart && (
        <div style={{ position:"fixed", top:0, right:0, bottom:0, width: 360, maxWidth:"100vw", background:"#FAF7F2", zIndex:200, boxShadow:"-8px 0 40px rgba(0,0,0,0.1)", padding:32, display:"flex", flexDirection:"column" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
            <span style={{ fontFamily:"Outfit", fontSize:20, fontWeight:500 }}>Košík</span>
            <span onClick={() => setShowCart(false)} style={{ cursor:"pointer", fontSize:24, color:"#8B7355" }}>×</span>
          </div>
          {cart.length === 0 ? (
            <p style={{ color:"#8B7355", fontSize:14 }}>Košík je prázdny</p>
          ) : (
            <div style={{ flex:1, overflowY:"auto" }}>
              {cart.map(item => (
                <div key={item.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderBottom:"1px solid #E8DCC8" }}>
                  <div>
                    <div style={{ fontSize:14, fontWeight:500 }}>{item.name}</div>
                    <div style={{ fontSize:12, color:"#8B7355" }}>{item.qty}× {item.price.toFixed(2)}€</div>
                  </div>
                  <span onClick={() => removeFromCart(item.id)} style={{ cursor:"pointer", color:"#C4A97D", fontSize:18 }}>×</span>
                </div>
              ))}
            </div>
          )}
          {cart.length > 0 && (
            <div style={{ borderTop:"1px solid #D3CABC", paddingTop:16, marginTop:16 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:16, fontWeight:500, marginBottom:12 }}>
                <span>Spolu</span>
                <span>{cartTotal.toFixed(2)}€</span>
              </div>
              {cartTotal < 40 && <p style={{ fontSize:11, color:"#8B7355", marginBottom:12 }}>Ešte {(40 - cartTotal).toFixed(2)}€ do dopravy zadarmo</p>}
              {cartTotal >= 40 && <p style={{ fontSize:11, color:"#4A6741", marginBottom:12, fontWeight:500 }}>Doprava zadarmo!</p>}
              <button className="btn-primary" style={{ width:"100%" }}>Objednať</button>
            </div>
          )}
        </div>
      )}

      {/* Hero */}
      <section style={{ minHeight: "100vh", display:"flex", alignItems:"center", padding:"120px 40px 80px", position:"relative", overflow:"hidden" }}>
        {/* Decorative bg circles */}
        <div style={{ position:"absolute", top:"10%", right:"-5%", width:400, height:400, borderRadius:"50%", background:"#4A6741", opacity:0.04 }} />
        <div style={{ position:"absolute", bottom:"10%", left:"-8%", width:300, height:300, borderRadius:"50%", background:"#6B4D7A", opacity:0.04 }} />

        <div style={{ maxWidth: 1100, margin:"0 auto", width:"100%", display:"grid", gridTemplateColumns:"1fr 1fr", gap:60, alignItems:"center" }}>
          <div>
            <div className="fade-up" style={{ display:"inline-block", marginBottom:20 }}>
              <span className="tag" style={{ background:"#4A6741", color:"#D9E8D4" }}>100% PRÍRODNÉ</span>
            </div>
            <h1 className="fade-up" style={{ fontFamily:"Outfit", fontSize:52, fontWeight:300, lineHeight:1.15, marginBottom:20, letterSpacing:-0.5 }}>
              Tvoj denný<br/>
              <span style={{ fontWeight:600, color:"#4A6741" }}>scrub rituál</span>
            </h1>
            <p className="fade-up-2" style={{ fontSize:16, lineHeight:1.7, color:"#5C4A30", maxWidth:420, marginBottom:32 }}>
              Olejové, kávové a prírodné scrubs vyrobené na Slovensku. Starostlivosť o telo, ktorá voní ako príroda.
            </p>
            <div className="fade-up-3" style={{ display:"flex", gap:12, alignItems:"center" }}>
              <button className="btn-primary">Objednať teraz</button>
              <button className="btn-outline">Zistiť viac</button>
            </div>
            <div className="fade-up-3" style={{ display:"flex", gap:24, marginTop:40, fontSize:12, color:"#8B7355", letterSpacing:1 }}>
              <span>VEGAN</span>
              <span style={{ color:"#D3CABC" }}>·</span>
              <span>ORGANIC</span>
              <span style={{ color:"#D3CABC" }}>·</span>
              <span>HANDMADE</span>
              <span style={{ color:"#D3CABC" }}>·</span>
              <span>CRUELTY FREE</span>
            </div>
          </div>

          <div style={{ display:"flex", justifyContent:"center", alignItems:"center", position:"relative" }}>
            <div className="float" style={{ position:"relative" }}>
              <ScrubCircle color="#4A6741" size={220} />
              <div style={{ position:"absolute", top:-30, right:-40 }}><ScrubCircle color="#6B4D7A" size={90} label="LAVENDER" /></div>
              <div style={{ position:"absolute", bottom:-20, left:-50 }}><ScrubCircle color="#8B7355" size={100} label="COFFEE" /></div>
              <div style={{ position:"absolute", bottom:40, right:-60 }}><ScrubCircle color="#C4A97D" size={70} label="SALT" /></div>
            </div>
          </div>
        </div>
      </section>

      {/* USP bar */}
      <section style={{ background:"#4A6741", padding:"28px 40px", display:"flex", justifyContent:"center", gap:48, flexWrap:"wrap" }}>
        {[
          { icon: "🌿", text: "100% prírodné zloženie" },
          { icon: "📦", text: "Doprava zadarmo od 40€" },
          { icon: "🇸🇰", text: "Vyrobené na Slovensku" },
          { icon: "♻️", text: "Ekologické balenie" },
        ].map((u, i) => (
          <div key={i} style={{ display:"flex", alignItems:"center", gap:10, color:"#D9E8D4", fontSize:13, letterSpacing:0.3 }}>
            <span style={{ fontSize:16 }}>{u.icon}</span>
            <span>{u.text}</span>
          </div>
        ))}
      </section>

      {/* Products */}
      <section style={{ padding:"80px 40px", maxWidth:1100, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:48 }}>
          <span className="tag" style={{ background:"#F5F0E8", color:"#8B7355", marginBottom:12, display:"inline-block" }}>PRODUKTY</span>
          <h2 style={{ fontFamily:"Outfit", fontSize:36, fontWeight:300, marginTop:8 }}>
            Vyber si svoj <span style={{ fontWeight:600, color:"#4A6741" }}>scrub</span>
          </h2>
        </div>

        <div style={{ display:"flex", gap:8, justifyContent:"center", marginBottom:40, flexWrap:"wrap" }}>
          {categories.map(c => (
            <button key={c.key} className={`filter-btn ${filter === c.key ? "active" : ""}`} onClick={() => setFilter(c.key)}>{c.label}</button>
          ))}
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))", gap:24 }}>
          {filtered.map(p => (
            <div key={p.id} className="product-card" style={{ background:"#fff", borderRadius:12, overflow:"hidden", border:"1px solid #E8DCC8" }}>
              <div style={{ height:200, background:`linear-gradient(135deg, ${p.color}15, ${p.color}08)`, display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
                <ScrubCircle color={p.color} size={100} />
                <span className="tag" style={{ position:"absolute", top:12, left:12, background:p.color, color:"#F5F0E8" }}>{p.tag}</span>
              </div>
              <div style={{ padding:"20px 20px 24px" }}>
                <h3 style={{ fontFamily:"Outfit", fontSize:18, fontWeight:500, marginBottom:4 }}>{p.name}</h3>
                <p style={{ fontSize:13, color:"#8B7355", marginBottom:4 }}>{p.desc}</p>
                <p style={{ fontSize:11, color:"#C4A97D", marginBottom:16 }}>{p.weight}</p>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontFamily:"Outfit", fontSize:22, fontWeight:500, color:"#4A6741" }}>{p.price.toFixed(2)}€</span>
                  <button className="btn-primary" style={{ padding:"10px 20px", fontSize:12 }} onClick={() => addToCart(p)}>Do košíka</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding:"80px 40px", background:"#1C1C1C" }}>
        <div style={{ maxWidth:900, margin:"0 auto", textAlign:"center" }}>
          <span className="tag" style={{ background:"rgba(74,103,65,0.2)", color:"#7DB872", marginBottom:12, display:"inline-block" }}>AKO NA TO</span>
          <h2 style={{ fontFamily:"Outfit", fontSize:36, fontWeight:300, color:"#F5F0E8", marginTop:8, marginBottom:48 }}>
            Jednoduchý <span style={{ fontWeight:600, color:"#7DB872" }}>rituál</span>
          </h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:40 }}>
            {[
              { step: "01", title: "Navlhči pokožku", desc: "Teplou vodou priprav pokožku na peeling" },
              { step: "02", title: "Nanášaj krúživými pohybmi", desc: "Jemne masíruj scrub 2-3 minúty" },
              { step: "03", title: "Opláchni a pocíť rozdiel", desc: "Hladká, hydratovaná a voňavá pokožka" },
            ].map((s, i) => (
              <div key={i}>
                <span style={{ fontFamily:"Outfit", fontSize:40, fontWeight:200, color:"#4A6741" }}>{s.step}</span>
                <h3 style={{ fontFamily:"Outfit", fontSize:18, fontWeight:500, color:"#F5F0E8", marginTop:8, marginBottom:8 }}>{s.title}</h3>
                <p style={{ fontSize:13, color:"#999", lineHeight:1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section style={{ padding:"80px 40px", maxWidth:1100, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:48 }}>
          <span className="tag" style={{ background:"#F5F0E8", color:"#8B7355", display:"inline-block" }}>RECENZIE</span>
          <h2 style={{ fontFamily:"Outfit", fontSize:36, fontWeight:300, marginTop:12 }}>
            Čo hovoria <span style={{ fontWeight:600, color:"#6B4D7A" }}>zákazníci</span>
          </h2>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:24 }}>
          {reviews.map((r, i) => (
            <div key={i} style={{ background:"#fff", borderRadius:12, padding:28, border:"1px solid #E8DCC8" }}>
              <div style={{ display:"flex", gap:2, marginBottom:12 }}>
                {[1,2,3,4,5].map(s => <Star key={s} filled={s <= r.rating} />)}
              </div>
              <p style={{ fontSize:14, lineHeight:1.6, color:"#5C4A30", marginBottom:16 }}>"{r.text}"</p>
              <p style={{ fontSize:12, fontWeight:500, color:"#8B7355" }}>{r.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section style={{ padding:"60px 40px", background:"linear-gradient(135deg, #4A6741 0%, #3A5333 100%)", textAlign:"center" }}>
        <div style={{ maxWidth:500, margin:"0 auto" }}>
          <h2 style={{ fontFamily:"Outfit", fontSize:28, fontWeight:300, color:"#F5F0E8", marginBottom:8 }}>
            Chceš <span style={{ fontWeight:600 }}>10% zľavu</span>?
          </h2>
          <p style={{ fontSize:14, color:"#B5D1A8", marginBottom:24 }}>Prihlás sa do newslettera a získaj zľavový kód na prvú objednávku.</p>
          {subscribed ? (
            <p style={{ color:"#D9E8D4", fontWeight:500, fontSize:16 }}>Ďakujeme! Skontroluj si email.</p>
          ) : (
            <div style={{ display:"flex", gap:8, maxWidth:400, margin:"0 auto" }}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tvoj@email.sk"
                style={{ flex:1, padding:"12px 20px", borderRadius:50, border:"1px solid rgba(255,255,255,0.2)", background:"rgba(255,255,255,0.1)", color:"#F5F0E8", fontSize:14, outline:"none" }}
              />
              <button className="btn-primary" style={{ background:"#1C1C1C" }} onClick={() => email && setSubscribed(true)}>Odoslať</button>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding:"48px 40px 32px", background:"#1C1C1C", color:"#999" }}>
        <div style={{ maxWidth:1100, margin:"0 auto", display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:40, marginBottom:40 }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
              <LeafIcon size={18} color="#7DB872" />
              <span style={{ fontFamily:"Outfit", fontWeight:500, fontSize:16, color:"#F5F0E8", letterSpacing:1 }}>bodyscrub<span style={{ color:"#7DB872" }}>.sk</span></span>
            </div>
            <p style={{ fontSize:13, lineHeight:1.6, maxWidth:280 }}>Prírodné scrubs vyrobené s láskou na Slovensku. Starostlivosť o telo, ktorá je dobrá pre teba aj planétu.</p>
          </div>
          <div>
            <h4 style={{ color:"#F5F0E8", fontSize:12, letterSpacing:2, marginBottom:16 }}>OBCHOD</h4>
            <div style={{ display:"flex", flexDirection:"column", gap:8, fontSize:13 }}>
              <span>Všetky produkty</span><span>Kávové scrubs</span><span>Olejové scrubs</span><span>Darčekové sety</span>
            </div>
          </div>
          <div>
            <h4 style={{ color:"#F5F0E8", fontSize:12, letterSpacing:2, marginBottom:16 }}>INFO</h4>
            <div style={{ display:"flex", flexDirection:"column", gap:8, fontSize:13 }}>
              <span>O nás</span><span>Blog</span><span>Kontakt</span><span>FAQ</span>
            </div>
          </div>
          <div>
            <h4 style={{ color:"#F5F0E8", fontSize:12, letterSpacing:2, marginBottom:16 }}>PRÁVNE</h4>
            <div style={{ display:"flex", flexDirection:"column", gap:8, fontSize:13 }}>
              <span>Obchodné podmienky</span><span>Ochrana údajov</span><span>Reklamácie</span><span>Cookies</span>
            </div>
          </div>
        </div>
        <div style={{ borderTop:"1px solid #333", paddingTop:20, display:"flex", justifyContent:"space-between", fontSize:12 }}>
          <span>© 2026 bodyscrub.sk. Všetky práva vyhradené.</span>
          <div style={{ display:"flex", gap:16 }}>
            <span>Instagram</span><span>Facebook</span><span>TikTok</span>
          </div>
        </div>
      </footer>
    </div>
  );
}