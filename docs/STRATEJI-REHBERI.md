# Forex Risk Yonetimi ve Strateji Rehberi

## Turkiye Piyasa Kosullari Ozeti

| Parametre | Deger |
|---|---|
| Kaldirac | 1:10 (sabit) |
| Teminat seviyesi | %100 (altta pozisyon acilamaz) |
| Stop-out | %20 |
| Stopaj vergisi | %10 |
| Sermaye | $2,000 - $2,500 |

---

## ALTIN KURAL: Risk Yonetimi

**Bu kurallari ASLA bozmamalisin:**

1. **Islem basina maksimum %1 risk** (deneyimli olunca %2'ye cikar)
2. **Stop loss ZORUNLU** - stop loss olmadan ASLA islem acma
3. **Gunluk kayip limiti %3** - asildiginda o gun islem yapma
4. **Haftalik kayip limiti %6** - asildiginda o hafta islem yapma
5. **Risk/Odul orani minimum 1:1.5** - tercihen 1:2 veya ustu

### $2,000 Hesap Icin Pratik Tablo

| Risk % | Risk Tutari | Maks Gunluk Kayip | Maks Haftalik Kayip |
|---|---|---|---|
| %0.5 | $10 | $30 (%1.5) | $60 (%3) |
| %1.0 | $20 | $60 (%3) | $120 (%6) |
| %1.5 | $30 | $90 (%4.5) | $180 (%9) |
| %2.0 | $40 | $120 (%6) | $240 (%12) |

**Onerim: %1 risk ile basla. Arka arkaya 3 kazancli islem yapinca %1.5'e cik. 2 kayiptan sonra %0.5'e dusur.**

---

## Araclar

### 1. TypeScript Pozisyon Hesaplayici (`src/`)

Konsoldan calistir:
```bash
npm run dev
```

Bu arac sana:
- Onerilen lot buyuklugu
- Gerekli teminat
- Risk tutari ve orani
- Makas maliyeti
- Vergi sonrasi net kazanc
- Teminat seviyesi ve stop-out mesafesi

hesaplar.

### 2. TradingView Pine Script Indikaterleri (`pinescript/`)

Uc adet Pine Script dosyasi var. Bunlari TradingView'e yuklemek icin:

1. TradingView'i ac
2. Alt paneldeki "Pine Editor" sekmesine tikla
3. Dosya icerigini kopyala/yapistir
4. "Kaydet" ve sonra "Grafiğe Ekle" butonlarina tikla

#### 2a. Coklu Onay Giris Stratejisi (`multi-confirmation-strategy.pine`)

Bu strateji, pozisyon acmak icin **birden fazla onay** gerektirir. Boylece duygusal/aceleyeislem girmeni onler.

**5 Onay Kaynagi:**
1. EMA Trend Yonu (Hizli EMA > Yavas EMA + fiyat > 200 EMA)
2. RSI Durumu (asiri alim/satim kontrolu)
3. MACD Momentum (MACD > sinyal cizgisi)
4. Hacim Onayi (hacim ortalamanin ustunde)
5. EMA Crossover (taze sinyal)

**Varsayilan: 3 onay gerekli.** Bunu kendin ayarlayabilirsin.

**Onerilerin:**
- Altin (XAUUSD) icin: 3 onay, ATR 14, SL carpani 2.0, TP carpani 3.0
- Hisse senetleri icin: 3 onay, ATR 14, SL carpani 1.5, TP carpani 3.0
- Volatil piyasalarda: 4 onay zorunlu yap

#### 2b. Risk Yonetim Paneli (`risk-management-overlay.pine`)

Bu indikator grafik uzerinde surekli sana:
- Onerilen lot buyuklugu
- SL/TP seviyeleri
- Teminat durumu
- Makas maliyeti
- Vergi sonrasi net kazanc
gosterir.

**Onemli:** Hesap bakiyeni ve enstruman parametrelerini (pip degeri, lot buyuklugu, makas) dogru gir.

#### 2c. Piyasa Yapisi + Giris Zamanlama (`market-structure.pine`)

Bu indikator:
- **HH/HL/LH/LL** (Higher High, Higher Low, Lower High, Lower Low) noktalarini gosterir
- **BOS** (Break of Structure) - trendin devam ettigi kirilmalari tespit eder
- **CHoCH** (Change of Character) - trend degisimlerini erken tespit eder
- **FVG** (Fair Value Gap) - bosluk bolgelerini gosterir
- **EMA Ribbon** - 5 farkli EMA ile trend gucunu gosterir
- **Mum Formasyonlari** - Engulfing ve Pin Bar tespit eder

---

## Strateji Kullanim Kilavuzu

### Adim 1: Buyuk Resme Bak (Gunluk/4 Saatlik Grafik)

1. `market-structure.pine` indikatorunu ac
2. Gunluk grafikte trend yonunu belirle:
   - HH + HL = Yukari trend
   - LH + LL = Asagi trend
   - Karisik = ISLEM YAPMA
3. EMA Ribbon rengine bak:
   - Yesil = Yukari
   - Kirmizi = Asagi
   - Gri = Belirsiz

### Adim 2: Giris Zamanlamasi (1 Saatlik/15 Dakikalik Grafik)

1. `multi-confirmation-strategy.pine` indikatorunu ac
2. Dusuk zaman diliminde onaylari kontrol et
3. Minimum 3 onay olmadan ISLEM ACMA
4. Guclu mum formasyonu bekle (engulfing veya pin bar)

### Adim 3: Islem Acmadan Once

1. `risk-management-overlay.pine` paneline bak
2. Kontrol listesi:
   - [ ] Trend yonu onaylandi mi?
   - [ ] En az 3 onay var mi?
   - [ ] SL dogru yerde mi?
   - [ ] R:R >= 1.5 mi?
   - [ ] Risk <= %1 mi?
   - [ ] Teminat seviyesi >= %200 mu?
   - [ ] Gunluk kayip limitim asilmadi mi?
   - [ ] Duygusal karar vermiyorum mu?
   - [ ] Bu islem stratejime uygun mu?

### Adim 4: Islem Yonetimi

1. Islem acildiktan sonra:
   - SL ve TP'ni DEGISTIRME
   - Grafigin basinda oturma
   - Alarmlari kur ve bildirim bekle
2. Trailing stop kullanmayi dusun (kazanclari korumak icin)
3. Kismen kar al:
   - 1R kazancta pozisyonun %50'sini kapat
   - SL'yi girise cek (basabasiz yap)
   - Kalan %50'yi TP'ye kadar tut

---

## Psikolojik Kurallar

### YAPMAMALISIN:

1. **Intikam islemi**: Kaybettiginde hemen geri kazanmaya calisma
2. **Overtrading**: Gunde 3'ten fazla islem acma
3. **SL tasima**: Stop loss'unu uzaklastirarak zarari buyutme
4. **TP kisaltma**: Take profit'ini yakinlastirarak kazanci kucultme
5. **Tum sermayeyi riske atma**: Tek islemde %2'den fazla riske girme
6. **Plansiz islem**: Kontrol listesini gecmeden islem acma
7. **Duygusal islem**: Korkuyla veya acilikla islem acma

### YAPMALISIN:

1. **Islem gunlugu tut**: Her islemi neden actigin, ne hissettigin, sonucu ne oldu yaz
2. **Sabit saatlerde islem yap**: Kendine belirli saatler belirle
3. **Gunluk limitlere uy**: 3 kayip = o gun islem bitir
4. **Haftalik degerlendir**: Her hafta sonu islemlerini gozden gecir
5. **Demo'da pratik yap**: Yeni stratejileri once demo hesapta test et
6. **Sabir goster**: Onay gelmeden islem acma, mumun kapanmasini bekle

---

## Enstruman Bazli Notlar

### Altin (XAUUSD)
- Cok volatil, genis SL gerektirir
- 1:10 kaldiracla $2000 sermaye ile maks ~0.07 lot
- Makas ortalama 30 pip ($0.30)
- En iyi saatler: Londra ve New York seanslarinin kesisimi (15:00-18:00 TR saati)

### Hisse Senetleri (TSLA, NVDA, AAPL, vb.)
- Fiyatlari yuksek olabilir, teminat kisitiyla dikkat
- Makas nispeten dusuk
- ABD piyasa saatlerinde islem yap (16:30-23:00 TR saati)
- Kazanc raporlari ve makro veriler oncesinde dikkatli ol

### Petrol (WTI, Brent)
- Orta volatilite
- Makas nispeten dusuk (3-5 pip)
- OPEC kararlari ve stok verileri onemli

---

## Baslangic Onerisi

**Ilk 1 ay:**
- Sadece XAUUSD (altin) ile islem yap
- Islem basina %0.5 risk
- Gunde maksimum 1-2 islem
- Tum 3 indikatoru birlikte kullan
- Her islemi gunluge yaz

**2-3. ay:**
- Risk %1'e cikabilir
- 2-3 enstruman ekle
- Haftalik performans degerlendirmesi yap

**4+ ay:**
- Kendin icin en iyi calisan parametreleri bul
- Risk %1.5'e cikabilir (istikrarli kazancli isen)
- Kendi kurallarini ekle

---

## Onemli Uyari

Bu araclar ve stratejiler kazanc garantisi VERMEZ. Hicbir strateji %100 basarili degildir.
Bu araclar sana DISIPLIN saglar, psikolojik hatalari AZALTIR ve riskleri YONETIR.

Piyasada hayatta kalmanin tek yolu: SERMAYENI KORUMAK.
Kazanmaktan once, kaybetmemeyi ogren.
