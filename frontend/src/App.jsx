import { useState, useEffect } from "react";
import "./App.css";

const STYLE = ["OS", "Flash", "RP", "RK", "TR", "A0"];

function App() {
  const [przejscia, setPrzejscia] = useState([]);
  
  const [lokalizacje, setLokalizacje] = useState([]);
  const [sektory, setSektory] = useState([]);
  const [drogi, setDrogi] = useState([]);

  const [statystyki, setStatystyki] = useState(null);

  // Stany formularza
  const [wybranaLokalizacja, setWybranaLokalizacja] = useState("");
  const [wybranySektor, setWybranySektor] = useState("");
  const [wybranaDroga, setWybranaDroga] = useState("");
  const [styl, setStyl] = useState(STYLE[2]);   
  const [liczbaProb, setLiczbaProb] = useState(1);
  const [ocena, setOcena] = useState("");            
  const [komentarz, setKomentarz] = useState(""); 
  
  const [edycjaId, setEdycjaId] = useState(null);

  const [formLogin, setFormLogin] = useState("");
  const [formHaslo, setFormHaslo] = useState("");
  const [zalogowanyUser, setZalogowanyUser] = useState(null); 

  const [wyszukiwaneMiasto, setWyszukiwaneMiasto] = useState("Podlesice");
  const [danePogody, setDanePogody] = useState(null);
  const [pogodaLoading, setPogodaLoading] = useState(false);
  const [wybranyDzien, setWybranyDzien] = useState(null);
  const [sugestie, setSugestie] = useState([]);
  const [pokazSugestie, setPokazSugestie] = useState(false);

  const [artykuly, setArtykuly] = useState([]);
  const [artykulyLoading, setArtykulyLoading] = useState(true);

  // Adresy API
  const API_GET = "http://localhost:8000/przejscia";
  const API_GET_LOKALIZACJE = "http://localhost:8000/lokalizacje"; 
  const API_GET_SECTORS = "http://localhost:8000/sektory";
  const API_GET_DROGI = "http://localhost:8000/drogi"; 
  const API_LOGIN = "http://localhost:8000/logowanie"; 
  const API_POST = "http://localhost:8000/dodajPrzejscie";
  const API_PUT = "http://localhost:8000/edytujPrzejscie";
  const API_STATS = "http://localhost:8000/statystyki";

  const fetchData = async () => {
    try {
      const res = await fetch(API_GET);
      const data = await res.json();
      
      if (Array.isArray(data)) {
        setPrzejscia(data);
      } else if (data && Array.isArray(data.przejscia)) {
        setPrzejscia(data.przejscia); 
      } else {
        setPrzejscia([]);
      }

      if (zalogowanyUser) {
        pobierzStatystyki(zalogowanyUser.id);
      }
    } catch (error) { console.error("Błąd pobierania przejść:", error); }
  };

  const pobierzStatystyki = async (userId) => {
    try {
      const res = await fetch(`${API_STATS}/${userId}`);
      const data = await res.json();
      setStatystyki(data);
    } catch (error) {
      console.error("Błąd pobierania statystyk z bazy:", error);
    }
  };

  const pobierzSlowniki = async () => {
    try {
      const resLokalizacje = await fetch(API_GET_LOKALIZACJE);
      const daneLokalizacje = await resLokalizacje.json();
      setLokalizacje(Array.isArray(daneLokalizacje) ? daneLokalizacje : []);
    } catch (error) { console.error("Błąd pobierania lokalizacji:", error); }

    try {
      const resSektory = await fetch(API_GET_SECTORS);
      const daneSektory = await resSektory.json();
      setSektory(Array.isArray(daneSektory) ? daneSektory : []);
    } catch (error) { console.error("Błąd pobierania sektorów:", error); }

    try {
      const resDrogi = await fetch(API_GET_DROGI);
      const daneDrogi = await resDrogi.json();
      setDrogi(Array.isArray(daneDrogi) ? daneDrogi : []);
    } catch (error) { console.error("Błąd pobierania dróg:", error); }
  };

  const pobierzNewsy = async () => {
    setArtykulyLoading(true);
    try {
      const res = await fetch("https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwspinanie.pl%2Ffeed%2F");
      const data = await res.json();
      if (data && data.items) {
        setArtykuly(data.items.slice(0, 6)); 
      }
    } catch (error) {
      console.error("Błąd podczas pobierania artykułów:", error);
    }
    setArtykulyLoading(false);
  };

  useEffect(() => {
    fetchData();
    pobierzSlowniki();
    pobierzPogode("Podlesice"); 
    pobierzNewsy(); 
  }, []);

  useEffect(() => {
    if (zalogowanyUser) {
      pobierzStatystyki(zalogowanyUser.id);
    }
  }, [zalogowanyUser]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (wyszukiwaneMiasto.length >= 2 && pokazSugestie) {
        try {
          const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${wyszukiwaneMiasto}&count=5&language=pl`);
          const geoData = await geoRes.json();
          setSugestie(geoData.results || []);
        } catch (err) {
          console.error(err);
        }
      } else {
        setSugestie([]);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [wyszukiwaneMiasto, pokazSugestie]);

  const pobierzPogode = async (miasto, lat = null, lon = null) => {
    if (!miasto) return;
    setPogodaLoading(true);
    setWybranyDzien(null);
    setPokazSugestie(false);

    try {
      let latitude = lat;
      let longitude = lon;
      let finalName = miasto;

      if (latitude === null || longitude === null) {
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(miasto)}&count=1&language=pl`);
        const geoData = await geoRes.json();

        if (!geoData.results || geoData.results.length === 0) {
          console.warn("Nie znaleziono rejonu:", miasto);
          setPogodaLoading(false);
          return;
        }
        latitude = geoData.results[0].latitude;
        longitude = geoData.results[0].longitude;
        finalName = geoData.results[0].name;
      }

      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=weather_code,temperature_2m,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max,apparent_temperature_max&past_days=2&timezone=auto`;
      const weatherRes = await fetch(weatherUrl);
      
      if (!weatherRes.ok) throw new Error("Błąd łączenia z Open-Meteo");
      
      const weatherData = await weatherRes.json();

      const daily = weatherData.daily || {};
      const current = weatherData.current || {};
      
      const sformatowaneDni = [0, 1, 2].map((i) => ({
        id: i === 0 ? 'przedwczoraj' : (i === 1 ? 'wczoraj' : 'dzisiaj'),
        nazwa: i === 0 ? "Przedwczoraj" : (i === 1 ? "Wczoraj" : "Dzisiaj"),
        kod: (daily.weather_code || daily.weathercode || [])[i] || 0,
        tempMax: (daily.temperature_2m_max || [])[i] || 0,
        tempMin: (daily.temperature_2m_min || [])[i] || 0,
        opady: (daily.precipitation_sum || [])[i] || 0,
        wiatrMax: (daily.wind_speed_10m_max || daily.windspeed_10m_max || [])[i] || 0,
        tempOdczuwalna: (daily.apparent_temperature_max || [])[i] || 0,
        tempObecna: i === 2 ? (current.temperature_2m || 0) : null
      }));

      setDanePogody({
        miasto: finalName,
        lat: latitude,
        lon: longitude,
        obecnaKod: current.weather_code || current.weathercode || 0,
        dni: sformatowaneDni
      });
    } catch (err) {
      console.error("Błąd pobierania pogody:", err);
    }
    setPogodaLoading(false);
  };

  const tlumaczPogode = (kod) => {
    if (kod === 0) return { ikona: "☀️", opis: "Bezchmurnie" };
    if (kod >= 1 && kod <= 3) return { ikona: "⛅", opis: "Część. zachmurzenie" };
    if (kod >= 45 && kod <= 48) return { ikona: "🌫️", opis: "Mgła" };
    if (kod >= 51 && kod <= 57) return { ikona: "🌧️", opis: "Mżawka" };
    if (kod >= 61 && kod <= 67) return { ikona: "🌧️", opis: "Deszcz" };
    if (kod >= 71 && kod <= 77) return { ikona: "❄️", opis: "Śnieg" };
    if (kod >= 80 && kod <= 82) return { ikona: "🌦️", opis: "Przelotny deszcz" };
    if (kod >= 95) return { ikona: "🌩️", opis: "Burza" };
    return { ikona: "❓", opis: "Brak danych" };
  };

  const resetForm = () => { 
    setWybranaLokalizacja("");
    setWybranySektor(""); 
    setWybranaDroga(""); 
    setStyl(STYLE[2]); 
    setLiczbaProb(1);
    setOcena("");
    setKomentarz("");
    setEdycjaId(null); 
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!formLogin || !formHaslo) return alert("Wpisz login i hasło!");
    
    try {
      const url = `${API_LOGIN}?login=${encodeURIComponent(formLogin)}&haslo=${encodeURIComponent(formHaslo)}`;
      
      const res = await fetch(url);
      const data = await res.json(); 

      if (data.zalogowano === true) {
        setZalogowanyUser({ login: formLogin, id: data.user_id }); 
      } else {
        alert("Błędny login lub hasło!");
        setFormHaslo(""); 
      }
    } catch (error) {
      console.error("Błąd podczas logowania:", error);
      alert("Nie udało się połączyć z serwerem logowania.");
    }
  };

  const handleLogout = () => {
    setZalogowanyUser(null);
    setStatystyki(null);
    setFormLogin("");
    setFormHaslo("");
    resetForm();
  };

  const dodaj = async () => {
    if (!zalogowanyUser) return alert("Musisz być zalogowany, żeby dodać przejście!");
    if (!wybranaDroga) return alert("Wybierz drogę, którą chcesz dodać!");

    const isFlashOrOS = ["OS", "Flash", "Bouldering - Flash"].includes(styl);
    const finalnaLiczbaProb = isFlashOrOS ? 1 : liczbaProb;

    try {
      const response = await fetch(API_POST, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: zalogowanyUser.id,
          droga_id: wybranaDroga,
          styl: styl,
          liczba_prob: finalnaLiczbaProb,
          ocena: ocena ? parseInt(ocena) : null,
          komentarz: komentarz ? komentarz : null
        })
      });

      if (response.ok) {
        alert("🧗 Sukces: Przejście zostało pomyślnie dodane do bazy danych!"); 
        resetForm(); 
        fetchData(); 
      } else {
        alert("Wystąpił błąd po stronie serwera podczas zapisywania przejścia.");
      }
    } catch (error) {
      console.error("Błąd przy dodawaniu:", error);
      alert("Nie udało się połączyć z API przy zapisie przejścia.");
    }
  };

  const usun = async (id, nazwaDrogi) => {
    const czyUsunac = window.confirm(`Czy na pewno chcesz usunąć przejście: ${nazwaDrogi}?`);
    if (!czyUsunac) return;

    try {
      const res = await fetch(`http://localhost:8000/usunPrzejscie/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("🗑️ Sukces: Przejście zostało trwale usunięte z Twojego dziennika."); 
        fetchData();
      } else {
        alert("Wystąpił błąd podczas usuwania przejścia po stronie serwera.");
      }
    } catch (error) {
      console.error("Błąd podczas usuwania:", error);
      alert("Nie udało się połączyć z serwerem.");
    }
  };

  const wlaczEdycje = (p) => {
    setEdycjaId(p.id); 
    
    const idDrogi = p.droga_id || p.drogaId || "";
    setWybranaDroga(idDrogi); 
    
    const znalezionaDroga = drogi.find(d => String(d.id) === String(idDrogi));
    const idSektora = znalezionaDroga ? (znalezionaDroga.sektorId || znalezionaDroga.sektor_id || znalezionaDroga.id_sektora) : "";
    setWybranySektor(idSektora);
    
    const znalezionySektor = sektory.find(s => String(s.id) === String(idSektora));
    const idLokalizacji = znalezionySektor ? (znalezionySektor.lokalizacja_id || znalezionySektor.lokalizacjaId) : "";
    setWybranaLokalizacja(idLokalizacji);

    setStyl(p.styl);
    setLiczbaProb(p.liczba_prob || 1);
    setOcena(p.ocena || "");
    setKomentarz(p.komentarz || ""); 
    
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const zapiszEdycje = async (id) => {
    if (!wybranaDroga) return alert("Wybierz drogę!");

    const isFlashOrOS = ["OS", "Flash", "Bouldering - Flash"].includes(styl);
    const finalnaLiczbaProb = isFlashOrOS ? 1 : liczbaProb;

    try {
      const response = await fetch(`${API_PUT}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          droga_id: wybranaDroga,
          styl: styl,
          liczba_prob: finalnaLiczbaProb,
          ocena: ocena ? parseInt(ocena) : null,
          komentarz: komentarz ? komentarz : null
        })
      });

      if (response.ok) {
        alert("✨ Sukces: Zmiany w przejściu zostały pomyślnie zaktualizowane!"); 
        resetForm(); 
        fetchData(); 
      } else {
        alert("Wystąpił błąd po stronie serwera podczas edycji przejścia.");
      }
    } catch (error) {
      console.error("Błąd przy edycji:", error);
      alert("Nie udało się połączyć z API przy edycji przejścia.");
    }
  };

  const pobranePrzejscia = Array.isArray(przejscia) ? przejscia : [];
  let mojePrzejscia = [];
  
  if (zalogowanyUser) {
    mojePrzejscia = pobranePrzejscia.filter(p => {
      const uId = p.user_id !== undefined ? p.user_id : (p.userId !== undefined ? p.userId : p.id_uzytkownika);
      return String(uId) === String(zalogowanyUser.id);
    });
  }

  // Obliczanie ulubionych stylów użytkownika
  const styleCount = mojePrzejscia.reduce((acc, p) => {
    const s = p.styl || "Nieznany";
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});
  const posortowaneStyle = Object.entries(styleCount).sort((a, b) => b[1] - a[1]);

  const isFlashOrOS = ["OS", "Flash", "Bouldering - Flash"].includes(styl);
  
  const wszystkiePrzejscia = statystyki?.staty_os?.ogolem || 0;
  const osOgolem = statystyki?.staty_os?.os_ogolem || 0;
  const globalnyProcentOS = wszystkiePrzejscia > 0 ? Math.round((osOgolem / wszystkiePrzejscia) * 100) : 0;

  // Odczyt przewspinanych metrów z nowej zmiennej
  const lacznieMetrow = statystyki?.lacznie_metrow || 0;

  // Logika wykresu liniowego SVG
  const punktyWykresu = statystyki?.daty_przejsc || [];
  
  const segmentWidth = 70; 
  const minSvgWidth = 400; 
  const svgWidth = Math.max(minSvgWidth, (punktyWykresu.length + 1) * segmentWidth);
  
  const paddingTop = 35;
  const paddingBottom = 35;
  const svgHeight = 150; 
  const dostepnaWysokosc = svgHeight - paddingTop - paddingBottom;
  const maxIloscWykres = punktyWykresu.length > 0 ? Math.max(...punktyWykresu.map(d => d.ilosc)) : 1;

  const wyswietlanePunkty = punktyWykresu.map((d, idx) => {
    let x = (idx + 1) * segmentWidth; 
    if (punktyWykresu.length === 1) {
      x = svgWidth / 2;
    }
    const y = paddingTop + dostepnaWysokosc - (d.ilosc / maxIloscWykres) * dostepnaWysokosc;
    return { x, y, val: d.ilosc, date: d.data_przejscia };
  });

  const sciezkaWykresu = wyswietlanePunkty.map((p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`; 
    const prev = wyswietlanePunkty[i - 1];
    const cpX = (prev.x + p.x) / 2; 
    return `C ${cpX} ${prev.y}, ${cpX} ${p.y}, ${p.x} ${p.y}`;
  }).join(' ');

  return (
    <div className="app-layout">
      
      <style>{`
        .list-scroll::-webkit-scrollbar { width: 6px; }
        .list-scroll::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.02); border-radius: 4px; }
        .list-scroll::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 4px; }
        .list-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
        
        .wykres-scroll::-webkit-scrollbar { height: 8px; }
        .wykres-scroll::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.02); border-radius: 4px; margin-top: 5px; }
        .wykres-scroll::-webkit-scrollbar-thumb { background: #8b5cf6; border-radius: 4px; }
        .wykres-scroll::-webkit-scrollbar-thumb:hover { background: #a78bfa; }
      `}</style>

      {/* --- KOLUMNA 1: LOGOWANIE + NEWSY --- */}
      <aside className="news-sidebar">
        <div className="login-card" style={{ marginBottom: '25px', padding: '15px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
          {!zalogowanyUser ? (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '0.95rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '5px' }}>🔑 Logowanie</h3>
              <input 
                type="text" 
                placeholder="Login" 
                value={formLogin} 
                onChange={(e) => setFormLogin(e.target.value)}
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #475569', background: '#1e293b', color: '#fff', fontSize: '0.85rem', width: '100%', boxSizing: 'border-box' }}
              />
              <input 
                type="password" 
                placeholder="Hasło" 
                value={formHaslo} 
                onChange={(e) => setFormHaslo(e.target.value)}
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #475569', background: '#1e293b', color: '#fff', fontSize: '0.85rem', width: '100%', boxSizing: 'border-box' }}
              />
              <button type="submit" style={{ padding: '8px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem', marginTop: '4px' }}>
                ZALOGUJ
              </button>
            </form>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', color: '#fff' }}>
              <h3 style={{ margin: 0, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '5px' }}>👤 Profil wspinacza</h3>
              <p style={{ margin: '4px 0', fontSize: '0.85rem', color: '#94a3b8' }}>
                Witaj, <strong style={{ color: '#60a5fa' }}>{zalogowanyUser.login}</strong>!
              </p>
              <button onClick={handleLogout} style={{ padding: '6px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.80rem', marginTop: '4px' }}>
                WYLOGUJ SIĘ
              </button>
            </div>
          )}
        </div>

        <h2 className="weather-header" style={{ color: '#ef4444', marginTop: 0 }}>Wspinanie.pl</h2>
        
        {artykulyLoading ? (
          <div style={{ textAlign: 'center', opacity: 0.5, marginTop: '20px' }}>Szukam newsów... 📡</div>
        ) : (
          <div className="news-list animate-view">
            {artykuly.map((art, idx) => (
              <a 
                key={idx} 
                href={art.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="news-item"
              >
                {(art.thumbnail || (art.enclosure && art.enclosure.link)) && (
                  <img src={art.thumbnail || art.enclosure.link} alt="Miniatura" className="news-thumb" />
                )}
                <div className="news-title">{art.title}</div>
                <div className="news-date">{new Date(art.pubDate).toLocaleDateString("pl-PL")}</div>
              </a>
            ))}
          </div>
        )}
      </aside>

      {/* --- KOLUMNA 2: DZIENNIK PRZEJŚĆ --- */}
      <div className="main-content">
        <h1>🧗 Dziennik Przejść</h1>

        {zalogowanyUser && (
          <div className="form-card">
            <h2>{edycjaId ? "📝 Edycja przejścia" : "➕ Nowy wpis"}</h2>
            <div className="input-group">
              
              <div className="row" style={{ marginBottom: '10px' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <label style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '5px', marginLeft: '5px' }}>
                    Wybierz Lokalizację
                  </label>
                  <select 
                    className="input-select" 
                    value={wybranaLokalizacja} 
                    onChange={(e) => {
                      setWybranaLokalizacja(e.target.value);
                      setWybranySektor("");
                      setWybranaDroga("");
                    }}
                  >
                    <option value="">-- Wybierz lokalizację --</option>
                    {lokalizacje.map(l => (
                      <option key={l.id} value={l.id}>
                        {l.nazwa}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <label style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '5px', marginLeft: '5px' }}>
                    Wybierz Sektor
                  </label>
                  <select 
                    className="input-select" 
                    value={wybranySektor} 
                    onChange={(e) => {
                      setWybranySektor(e.target.value);
                      setWybranaDroga("");
                    }}
                    disabled={!wybranaLokalizacja}
                  >
                    <option value="">-- Wybierz sektor --</option>
                    {Array.isArray(sektory) && sektory
                      .filter(s => {
                        const idLokalizacjiWSektorze = s?.lokalizacja_id || s?.lokalizacjaId;
                        return idLokalizacjiWSektorze != null && String(idLokalizacjiWSektorze) === String(wybranaLokalizacja);
                      })
                      .map(s => (
                        <option key={s.id} value={s.id}>
                          {s.nazwa}
                        </option>
                      ))
                    }
                  </select>
                </div>
              </div>

              <div className="row">
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <label style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '5px', marginLeft: '5px' }}>
                    Wybierz Drogę
                  </label>
                  <select 
                    className="input-select" 
                    value={wybranaDroga} 
                    onChange={(e) => setWybranaDroga(e.target.value)}
                    disabled={!wybranySektor}
                  >
                    <option value="">-- Wybierz drogę --</option>
                    {Array.isArray(drogi) && drogi
                      .filter(d => {
                        const idSektoraWDrodze = d?.sektorId || d?.sektor_id || d?.id_sektora;
                        return idSektoraWDrodze != null && String(idSektoraWDrodze) === String(wybranySektor);
                      })
                      .map(d => (
                        <option key={d?.id || Math.random()} value={d?.id}>
                          {d?.nazwa || "Brak nazwy"} ({d?.stopien || "?"})
                        </option>
                      ))
                    }
                  </select>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <label style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '5px', marginLeft: '5px' }}>STYL</label>
                  <select className="input-select" value={styl} onChange={(e) => setStyl(e.target.value)}>
                    <optgroup label="Lina (Sportowe)">
                      <option value="OS">OS (On-Sight)</option>
                      <option value="Flash">Flash</option>
                      <option value="RP">RP (Redpoint)</option>
                      <option value="RK">RK (Rotpunkt)</option>
                      <option value="TR">TR (Top Rope)</option>
                      <option value="A0">A0 (Haczenie)</option>
                    </optgroup>
                    <optgroup label="Bouldering">
                      <option value="Bouldering - Flash">Flash (Bouldering)</option>
                      <option value="Bouldering - RP">RP (Bouldering)</option>
                    </optgroup>
                  </select>
                </div>
              </div>

              <div className="row" style={{ marginTop: '10px' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <label style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '5px', marginLeft: '5px' }}>
                    Liczba prób
                  </label>
                  <input 
                    type="number" 
                    className="input-select"
                    min="1"
                    value={isFlashOrOS ? 1 : liczbaProb} 
                    onChange={(e) => setLiczbaProb(e.target.value)}
                    disabled={isFlashOrOS}
                    style={{ boxSizing: 'border-box', height: '38px', opacity: isFlashOrOS ? 0.6 : 1 }}
                  />
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <label style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '5px', marginLeft: '5px' }}>
                    Ocena drogi
                  </label>
                  <select 
                    className="input-select" 
                    value={ocena} 
                    onChange={(e) => setOcena(e.target.value)}
                  >
                    <option value="">-- Brak oceny --</option>
                    <option value="1">1 ⭐ (Słaba)</option>
                    <option value="2">2 ⭐ (Ujdzie)</option>
                    <option value="3">3 ⭐ (Średnia)</option>
                    <option value="4">4 ⭐ (Dobra)</option>
                    <option value="5">5 ⭐ (Klasyk!)</option>
                  </select>
                </div>
              </div>

              <div className="row" style={{ marginTop: '10px' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <label style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '5px', marginLeft: '5px' }}>
                    Komentarz (opcjonalnie)
                  </label>
                  <textarea 
                    className="input-select" 
                    value={komentarz} 
                    onChange={(e) => setKomentarz(e.target.value)}
                    placeholder="Jak poszło? Wpisz patenty, odczucia..."
                    style={{ 
                      boxSizing: 'border-box', 
                      height: '60px', 
                      resize: 'vertical',
                      background: '#1e293b', 
                      color: '#fff', 
                      border: '1px solid #475569', 
                      borderRadius: '4px',
                      padding: '8px',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>
              </div>
              
              <div className="row" style={{ marginTop: '15px' }}>
                <button className="btn-submit" style={{ flex: 2 }} onClick={edycjaId ? () => zapiszEdycje(edycjaId) : dodaj}>
                  {edycjaId ? "ZAPISZ ZMIANY" : "DODAJ DO DZIENNIKA"}
                </button>
                {edycjaId && <button className="btn-cancel" style={{ flex: 1 }} onClick={resetForm}>ANULUJ</button>}
              </div>
            </div>
          </div>
        )}

        <div className="list-section">
          <h2 className="list-header">Moja historia</h2>
          
          {!zalogowanyUser ? (
            <p style={{ textAlign: "center", opacity: 0.6, padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
              🔒 Zaloguj się, aby zobaczyć swoje przejścia.
            </p>
          ) : mojePrzejscia.length > 0 ? (
            mojePrzejscia.map((p) => {
              const droga = drogi.find(d => String(d.id) === String(p.droga_id));
              
              return (
                <div key={p.id || Math.random()} className="route-card">
                  <div className="route-main-info">
                    <div>
                      <span className="grade-tag">{droga ? droga.stopien : "—"}</span>
                      <span className="route-name">{droga ? droga.nazwa : `Droga (ID: ${p.droga_id})`}</span>
                    </div>
                    
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '6px' }}>
                      Data przejścia: {p.data_przejscia ? new Date(p.data_przejscia).toLocaleDateString("pl-PL") : "Brak danych"}
                    </div>
                    
                    <div className="style-info" style={{ marginTop: '4px' }}>
                      Styl: <strong style={{color: '#e2e8f0'}}>{p.styl || "—"}</strong> 
                      <span style={{ margin: '0 8px', color: '#475569' }}>|</span> 
                      Liczba prób: <strong style={{color: '#e2e8f0'}}>{p.liczba_prob || "—"}</strong>
                      {p.ocena && (
                        <>
                          <span style={{ margin: '0 8px', color: '#475569' }}>|</span> 
                          Ocena: <strong style={{color: '#fbbf24'}}>{p.ocena} / 5</strong>
                        </>
                      )}
                    </div>

                    {p.komentarz && (
                      <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '8px', fontStyle: 'italic', background: 'rgba(255,255,255,0.05)', padding: '6px', borderRadius: '4px' }}>
                        💬 "{p.komentarz}"
                      </div>
                    )}
                  </div>
                  
                  <div className="actions">
                    <button className="edit-icon" onClick={() => wlaczEdycje(p)}>✏️</button>
                    <button className="btn-delete" onClick={() => usun(p.id, droga ? droga.nazwa : p.droga_id)}>USUŃ</button>
                  </div>
                </div>
              );
            })
          ) : (
            <p style={{ textAlign: "center", opacity: 0.4 }}>Brak przejść. Czas na skały!</p>
          )}
        </div>

        {/* --- STATYSTYKI Z KAFELKAMI W SIATCE 2x2 --- */}
        {zalogowanyUser && statystyki && (
          <div className="list-section animate-view" style={{ marginTop: '30px', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <h2 className="list-header" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>📊 Statystyki bazy danych</h2>
            
            {/* SZTYWNA SIATKA 2x2 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
              
              {/* KAFELEK 1: LOKALIZACJE */}
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', minHeight: '220px', display: 'flex', flexDirection: 'column' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#60a5fa', fontSize: '0.9rem' }}>🗺️ Dróg w rejonach</h4>
                <div className="list-scroll" style={{ flex: 1, overflowY: 'auto', paddingRight: '5px' }}>
                  {statystyki.drog_lokalizacje?.map((l, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <span style={{ color: '#cbd5e1' }}>{l.nazwa}</span>
                      <strong style={{ color: '#fff' }}>{l.ilosc}</strong>
                    </div>
                  ))}
                </div>
              </div>

              {/* KAFELEK 2: SEKTORY */}
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', minHeight: '220px', display: 'flex', flexDirection: 'column' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#34d399', fontSize: '0.9rem' }}>🧗 Dróg w sektorach</h4>
                <div className="list-scroll" style={{ flex: 1, overflowY: 'auto', paddingRight: '5px' }}>
                  {statystyki.drog_sektory?.map((s, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <span style={{ color: '#cbd5e1' }}>{s.nazwa}</span>
                      <strong style={{ color: '#fff' }}>{s.ilosc}</strong>
                    </div>
                  ))}
                </div>
              </div>

              {/* KAFELEK 3: GLOBALNY RANKING POPULARNOŚCI DRÓG (Top 5) */}
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', minHeight: '220px', display: 'flex', flexDirection: 'column' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#f43f5e', fontSize: '0.9rem' }}>🔥 Top 5 najpopularniejszych dróg</h4>
                <div className="list-scroll" style={{ flex: 1, overflowY: 'auto', paddingRight: '5px' }}>
                  {statystyki.popularnosc_drog?.length > 0 ? (
                    statystyki.popularnosc_drog.slice(0, 5).map((d, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                        <span style={{ color: '#cbd5e1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: '10px' }}>
                          {idx + 1}. {d.nazwa}
                        </span>
                        <strong style={{ color: '#fff', whiteSpace: 'nowrap' }}>{d.liczba_przejsc} <span style={{fontSize: '0.7rem', opacity: 0.7}}>razy</span></strong>
                      </div>
                    ))
                  ) : (
                    <p style={{ fontSize: '0.85rem', opacity: 0.5, textAlign: 'center' }}>Brak przejść w bazie.</p>
                  )}
                </div>
              </div>

              {/* KAFELEK 4: MOJE STYLE PRZEJŚĆ */}
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', minHeight: '220px', display: 'flex', flexDirection: 'column' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#c084fc', fontSize: '0.9rem' }}>🏷️ Moje style przejść</h4>
                <div className="list-scroll" style={{ flex: 1, overflowY: 'auto', paddingRight: '5px' }}>
                  {posortowaneStyle.length > 0 ? (
                    posortowaneStyle.map(([stylNazwa, ilosc], idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                        <span style={{ color: '#cbd5e1' }}>{stylNazwa}</span>
                        <strong style={{ color: '#fff' }}>{ilosc} <span style={{fontSize: '0.7rem', opacity: 0.7}}>dróg</span></strong>
                      </div>
                    ))
                  ) : (
                    <p style={{ fontSize: '0.85rem', opacity: 0.5, textAlign: 'center' }}>Brak wpisów.</p>
                  )}
                </div>
              </div>

            </div>

            {/* DODATKOWA SIATKA: Skuteczność OS + ŁĄCZNA ILOŚĆ METRÓW */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '25px' }}>
              
              {/* Skuteczność OS */}
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h4 style={{ margin: '0 0 12px 0', color: '#fbbf24', fontSize: '0.9rem' }}>🎯 Skuteczność On-Sight (Twój profil)</h4>
                {wszystkiePrzejscia === 0 ? (
                  <p style={{ fontSize: '0.85rem', opacity: 0.5, textAlign: 'center', margin: 0 }}>Brak wpisów w Twoim dzienniku.</p>
                ) : (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
                      <span style={{ color: '#fff' }}>
                        Poprowadzono OS: <strong>{osOgolem}</strong> z {wszystkiePrzejscia} przejść
                      </span>
                      <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>{globalnyProcentOS}% OS</span>
                    </div>
                    <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '5px', overflow: 'hidden' }}>
                      <div style={{ width: `${globalnyProcentOS}%`, height: '100%', background: 'linear-gradient(90deg, #d97706, #fbbf24)', transition: 'width 0.5s ease' }}></div>
                    </div>
                  </div>
                )}
              </div>

              {/* NOWOŚĆ: KAFELEK METRY WSPINACZKOWE */}
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <h4 style={{ margin: '0 0 6px 0', color: '#a78bfa', fontSize: '0.9rem' }}>🧗 Suma przewspinanych metrów</h4>
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#c084fc', textShadow: '0 0 10px rgba(167, 139, 250, 0.3)' }}>
                  {lacznieMetrow} <span style={{ fontSize: '1rem', color: '#94a3b8', fontWeight: 'normal' }}>m</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                  (Długość dróg × podjęte próby)
                </div>
              </div>

            </div>

            {/* WYKRES AKTYWNOŚCI SVG */}
            <div style={{ 
              background: 'rgba(255,255,255,0.02)', 
              padding: '15px', 
              borderRadius: '8px', 
              border: '1px solid rgba(255,255,255,0.05)',
              maxWidth: '100%', 
              boxSizing: 'border-box'
            }}>
              <h4 style={{ margin: '0 0 15px 0', color: '#a78bfa', fontSize: '0.9rem' }}>📈 Aktywność (kolejne dni z dziennika)</h4>
              
              {wyswietlanePunkty.length === 0 ? (
                <p style={{ fontSize: '0.85rem', opacity: 0.5, textAlign: 'center' }}>Brak danych do wyrenderowania wykresu.</p>
              ) : (
                <div className="wykres-scroll" style={{ overflowX: 'auto', overflowY: 'hidden', width: '100%', paddingBottom: '10px' }}>
                  <svg width={svgWidth} height={svgHeight} style={{ display: 'block' }}>
                    
                    <line x1="0" y1={svgHeight - paddingBottom} x2={svgWidth} y2={svgHeight - paddingBottom} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

                    <path 
                      d={sciezkaWykresu} 
                      fill="none" 
                      stroke="#8b5cf6" 
                      strokeWidth="3" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      style={{ filter: 'drop-shadow(0px 4px 6px rgba(139, 92, 246, 0.4))' }}
                    />
                    
                    {wyswietlanePunkty.map((p, idx) => (
                      <g key={idx}>
                        <line 
                          x1={p.x} y1={p.y + 8} x2={p.x} y2={svgHeight - paddingBottom + 5} 
                          stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="4,4" 
                        />
                        <circle 
                          cx={p.x} cy={p.y} r="5" 
                          fill="#1e293b" stroke="#c4b5fd" strokeWidth="2.5" 
                        />
                        <text 
                          x={p.x} y={p.y - 12} 
                          fill="#c4b5fd" fontSize="11" fontWeight="bold" textAnchor="middle"
                        >
                          {p.val}
                        </text>
                        <text 
                          x={p.x} y={svgHeight - 15} 
                          fill="#94a3b8" fontSize="10" textAnchor="middle"
                        >
                          {new Date(p.date).toLocaleDateString("pl-PL", { day: '2-digit', month: 'short' })}
                        </text>
                        <text 
                          x={p.x} y={svgHeight - 2} 
                          fill="rgba(255,255,255,0.2)" fontSize="9" textAnchor="middle"
                        >
                          {new Date(p.date).getFullYear()}
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>
              )}
            </div>

          </div>
        )}

      </div>

      {/* --- KOLUMNA 3: POGODA --- */}
      <aside className="weather-sidebar">
        <h2 className="weather-header">Sprawdź Pogodę</h2>
        
        <div className="weather-search" style={{ position: 'relative', display: 'flex', gap: '10px', marginBottom: '25px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <input 
              style={{ width: '100%', marginBottom: 0 }}
              type="text" 
              placeholder="Wpisz rejon..." 
              value={wyszukiwaneMiasto}
              onChange={(e) => {
                setWyszukiwaneMiasto(e.target.value);
                setPokazSugestie(true);
              }}
              onKeyDown={(e) => {
                if(e.key === 'Enter') pobierzPogode(wyszukiwaneMiasto);
              }}
              onFocus={() => setPokazSugestie(true)}
              onBlur={() => setTimeout(() => setPokazSugestie(false), 200)}
            />

            {pokazSugestie && sugestie.length > 0 && (
              <ul className="suggestions-list">
                {sugestie.map((s, idx) => (
                  <li 
                    key={idx} 
                    className="suggestion-item"
                    onClick={() => {
                      setWyszukiwaneMiasto(s.name);
                      pobierzPogode(s.name, s.latitude, s.longitude); 
                    }}
                  >
                    <div style={{ fontWeight: 'bold', color: 'white' }}>{s.name}</div>
                    <div className="suggestion-details">
                      {[s.admin1, s.country].filter(Boolean).join(", ")}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          {danePogody && danePogody.lat && (
            <button 
              onClick={() => window.open(`https://mapy.cz/turisticka?q=${danePogody.lat},${danePogody.lon}`, '_blank')}
              title="Pokaż rejon na Mapy.cz"
              style={{ background: '#16a34a' }} 
            >
              🗺️
            </button>
          )}

          <button onClick={() => pobierzPogode(wyszukiwaneMiasto)}>🔍</button>
        </div>

        {pogodaLoading ? (
          <div style={{ textAlign: 'center', opacity: 0.5 }}>Szukam chmur... ☁️</div>
        ) : danePogody ? (
          
          wybranyDzien ? (
            <div className="weather-details-view animate-view" key={`detale-${wybranyDzien.id}`}>
              <button className="btn-back" onClick={() => setWybranyDzien(null)}>
                ⬅ Wróć do podsumowania
              </button>
              
              <h3 style={{ margin: 0, color: 'white' }}>{danePogody.miasto}</h3>
              <p style={{ color: 'var(--accent-color)', marginTop: '5px', fontWeight: 'bold' }}>
                {wybranyDzien.nazwa}
              </p>
              
              <div className="weather-icon" style={{ fontSize: '5rem' }}>
                {tlumaczPogode(danePogody.obecnaKod).ikona}
              </div>
              <div className="weather-desc" style={{ fontSize: '1.1rem' }}>
                {tlumaczPogode(danePogody.obecnaKod).opis}
              </div>
              
              <div className="details-grid">
                <div className="detail-item">
                  Temperatura
                  <strong>{wybranyDzien.tempMax}° / {wybranyDzien.tempMin}°</strong>
                </div>
                <div className="detail-item">
                  Suma opadów
                  <strong style={{ color: wybranyDzien.opady > 0 ? '#60a5fa' : 'inherit' }}>
                    {wybranyDzien.opady} mm
                  </strong>
                </div>
                <div className="detail-item">
                  Max Wiatr
                  <strong>{wybranyDzien.wiatrMax} km/h</strong>
                </div>
                <div className="detail-item">
                  Odczuwalna
                  <strong>{wybranyDzien.tempOdczuwalna}°C</strong>
                </div>
              </div>
            </div>
          ) : (
            <div className="animate-view" key="podsumowanie-glowne">
              <div className="weather-info" title="Kliknij po szczegóły" onClick={() => setWybranyDzien(danePogody.dni[2])}>
                <h3 style={{ margin: 0, color: 'white' }}>{danePogody.miasto}</h3>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '3px' }}>DZISIAJ</div>
                <div className="weather-icon">{tlumaczPogode(danePogody.obecnaKod).ikona}</div>
                <div className="weather-temp">{danePogody.dni[2].tempObecna}°C</div>
                <div className="weather-desc">{tlumaczPogode(danePogody.obecnaKod).opis}</div>

                <div className="weather-details" style={{ border: 'none', padding: 0, marginTop: '10px' }}>
                  <span style={{color: '#60a5fa'}}>Szczegóły pogody ➡</span>
                </div>
              </div>

              <div className="historical-weather">
                <div className="history-card" title="Kliknij po szczegóły" onClick={() => setWybranyDzien(danePogody.dni[0])}>
                  <div className="date">{danePogody.dni[0].nazwa}</div>
                  <div className="icon">{tlumaczPogode(danePogody.dni[0].kod).ikona}</div>
                  <div className="temp">{danePogody.dni[0].tempMax}°C</div>
                </div>
                <div className="history-card" title="Kliknij po szczegóły" onClick={() => setWybranyDzien(danePogody.dni[1])}>
                  <div className="date">{danePogody.dni[1].nazwa}</div>
                  <div className="icon">{tlumaczPogode(danePogody.dni[1].kod).kod}</div>
                  <div className="temp">{danePogody.dni[1].tempMax}°C</div>
                </div>
              </div>
            </div>
          )
        ) : null}
      </aside>

    </div>
  );
}

export default App;