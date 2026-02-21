# Mouse Açı Düzeltme - Arduino Leonardo + USB Host Shield

Mouse'u eğik tutmaktan kaynaklanan hareket sapmasını düzeltir.

## Donanım Gereksinimleri

- **Arduino Leonardo** (ATmega32U4 - dahili USB HID desteği)
- **USB Host Shield 2.0**
- Herhangi bir USB mouse

## Bağlantı Şeması

```
[USB Mouse] → [USB Host Shield] → [Arduino Leonardo] → [Bilgisayar]
                                        (USB kablosu ile)
```

USB Host Shield, Arduino Leonardo'nun üzerine takılır (shield formatı).

## Kurulum

1. Arduino IDE'de **USB Host Shield 2.0** kütüphanesini yükleyin:
   - `Sketch → Include Library → Manage Libraries`
   - "USB Host Shield" arayın ve yükleyin

2. Board olarak **Arduino Leonardo** seçin:
   - `Tools → Board → Arduino Leonardo`

3. `mouse_angle_fix.ino` dosyasını açın ve yükleyin

## Kullanım

### Açıyı Ayarlama

Varsayılan düzeltme açısı **7 derece**'dir. Bunu iki şekilde değiştirebilirsiniz:

**Kod içinden (kalıcı):**
```cpp
float correctionAngleDeg = 7.0;  // Bu değeri değiştirin
```

**Serial Monitor üzerinden (anında, geçici):**
```
angle=5.5    → Açıyı 5.5 dereceye ayarla
a=10         → Açıyı 10 dereceye ayarla
sens=1.2     → Hassasiyeti 1.2x yap
status       → Mevcut ayarları göster
help         → Komut listesi
```

### Doğru Açıyı Bulma

1. Paint veya benzeri bir çizim programı açın
2. Serial Monitor'ü açın (115200 baud)
3. Yatay bir çizgi çizmeyi deneyin
4. Çizgi yukarı kayıyorsa → açıyı artırın (`angle=8`)
5. Çizgi aşağı kayıyorsa → açıyı azaltın (`angle=5`)
6. Düz çizgi çizene kadar ince ayar yapın
7. Doğru açıyı bulunca koda yazıp tekrar yükleyin

### Açı Yönü

- **Pozitif değer**: Mouse saat yönünde eğik (sağa yatık) → düzeltir
- **Negatif değer**: Mouse saat yönü tersine eğik (sola yatık) → düzeltir

## Nasıl Çalışır

Fiziksel mouse'dan gelen ham X/Y hareket verilerine bir **rotasyon matrisi** uygulanır:

```
x' =  x·cos(θ) + y·sin(θ)
y' = -x·sin(θ) + y·cos(θ)
```

Bu, koordinat sistemini mouse'un fiziksel eğimi kadar ters yönde döndürür ve hareketi düzeltir. Sub-piksel hassasiyeti için kayan nokta artık birikimi kullanılır.
