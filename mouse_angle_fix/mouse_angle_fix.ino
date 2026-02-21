/*
 * Mouse Angle Correction - Arduino Leonardo + USB Host Shield
 *
 * Fiziksel mouse'dan gelen hareket verilerini okur,
 * bir rotasyon matrisi ile açı düzeltmesi uygular
 * ve düzeltilmiş hareketi Leonardo'nun dahili USB HID
 * mouse olarak bilgisayara gönderir.
 *
 * Donanim:
 *   - Arduino Leonardo (ATmega32U4 - dahili USB HID destegi)
 *   - USB Host Shield 2.0
 *   - Herhangi bir USB mouse
 *
 * Baglanti:
 *   USB Host Shield -> Arduino Leonardo (SPI baglantisi)
 *   Mouse -> USB Host Shield'in USB portuna
 *   Leonardo -> Bilgisayara USB ile
 *
 * Kutuphane Gereksinimleri:
 *   - USB Host Shield 2.0 (https://github.com/felis/USB_Host_Shield_2.0)
 *   - Mouse.h (Leonardo'da dahili)
 */

#include <hidboot.h>
#include <usbhub.h>
#include <Mouse.h>
#include <SPI.h>

// ============================================================
// ACI AYARI (derece cinsinden)
// ============================================================
// Pozitif deger = saat yonunde egimi duzeltir (mouse saga yanik)
// Negatif deger = saat yonunun tersini duzeltir (mouse sola yanik)
//
// Goruntunuzden yaklasik 7 derece saat yonu egimi tespit edildi.
// Bu degeri ihtiyaciniza gore ince ayar yapin.
float correctionAngleDeg = 7.0;

// Hassasiyet carpani (1.0 = degisiklik yok, >1 = hizlandir, <1 = yavaslar)
float sensitivityMultiplier = 1.0;

// ============================================================
// Dahili degiskenler
// ============================================================
float cosA = 1.0;
float sinA = 0.0;

// Kayan nokta artik biriktiricileri (sub-piksel hassasiyeti icin)
float residualX = 0.0;
float residualY = 0.0;

// Seri port uzerinden hata ayiklama (Serial Monitor'de gorunur)
// Uretimde false yapin - gecikme azalir
const bool DEBUG_OUTPUT = false;

// ============================================================
// USB Host Shield mouse isleyicisi
// ============================================================
class MouseParser : public HIDReportParser {
public:
  void Parse(USBHID *hid, bool is_rpt_id, uint8_t len, uint8_t *buf) override;
};

void MouseParser::Parse(USBHID *hid, bool is_rpt_id, uint8_t len, uint8_t *buf) {
  // Standart USB mouse rapor formati:
  // buf[0] = butonlar (bit0=sol, bit1=sag, bit2=orta)
  // buf[1] = X hareketi (isarteli 8-bit)
  // buf[2] = Y hareketi (isarteli 8-bit)
  // buf[3] = scroll tekerlek (varsa)

  if (len < 3) return;

  uint8_t buttons = buf[0];
  int8_t rawX = (int8_t)buf[1];
  int8_t rawY = (int8_t)buf[2];
  int8_t rawScroll = (len > 3) ? (int8_t)buf[3] : 0;

  // ----------------------------------------------------------
  // Rotasyon matrisi uygula
  // ----------------------------------------------------------
  // | x' |   | cos(a)  sin(a) | | x |
  // | y' | = | -sin(a) cos(a) | | y |
  //
  // Bu, giris koordinatlarini -a derece dondurur
  // (saat yonu egimini duzeltmek icin saat yonu tersine dondurme)
  // ----------------------------------------------------------
  float rotatedX = (rawX * cosA + rawY * sinA) * sensitivityMultiplier;
  float rotatedY = (-rawX * sinA + rawY * cosA) * sensitivityMultiplier;

  // Sub-piksel birikimini ekle
  rotatedX += residualX;
  rotatedY += residualY;

  // Tam sayi piksel degerlerini cikar
  int moveX = (int)rotatedX;
  int moveY = (int)rotatedY;

  // Artiklarini bir sonraki cevrim icin sakla
  residualX = rotatedX - moveX;
  residualY = rotatedY - moveY;

  // ----------------------------------------------------------
  // Buton durumlarini isle
  // ----------------------------------------------------------
  static uint8_t prevButtons = 0;

  // Sol buton
  if ((buttons & 0x01) && !(prevButtons & 0x01)) {
    Mouse.press(MOUSE_LEFT);
  } else if (!(buttons & 0x01) && (prevButtons & 0x01)) {
    Mouse.release(MOUSE_LEFT);
  }

  // Sag buton
  if ((buttons & 0x02) && !(prevButtons & 0x02)) {
    Mouse.press(MOUSE_RIGHT);
  } else if (!(buttons & 0x02) && (prevButtons & 0x02)) {
    Mouse.release(MOUSE_RIGHT);
  }

  // Orta buton
  if ((buttons & 0x04) && !(prevButtons & 0x04)) {
    Mouse.press(MOUSE_MIDDLE);
  } else if (!(buttons & 0x04) && (prevButtons & 0x04)) {
    Mouse.release(MOUSE_MIDDLE);
  }

  prevButtons = buttons;

  // ----------------------------------------------------------
  // Duzeltilmis hareketi gonder
  // ----------------------------------------------------------
  if (moveX != 0 || moveY != 0 || rawScroll != 0) {
    Mouse.move(moveX, moveY, rawScroll);
  }

  // ----------------------------------------------------------
  // Hata ayiklama ciktisi
  // ----------------------------------------------------------
  if (DEBUG_OUTPUT && (rawX != 0 || rawY != 0)) {
    Serial.print("Ham: X=");
    Serial.print(rawX);
    Serial.print(" Y=");
    Serial.print(rawY);
    Serial.print(" -> Duzeltilmis: X=");
    Serial.print(moveX);
    Serial.print(" Y=");
    Serial.println(moveY);
  }
}

// ============================================================
// Global nesneler
// ============================================================
USB usb;
HIDBoot<USB_HID_PROTOCOL_MOUSE> hidMouse(&usb);
MouseParser mouseParser;

// ============================================================
// Seri port uzerinden aci ayarlama
// ============================================================
void checkSerialCommands() {
  if (!Serial.available()) return;

  String input = Serial.readStringUntil('\n');
  input.trim();

  if (input.length() == 0) return;

  if (input.startsWith("angle=") || input.startsWith("a=")) {
    int eqPos = input.indexOf('=');
    float newAngle = input.substring(eqPos + 1).toFloat();

    if (newAngle >= -45.0 && newAngle <= 45.0) {
      correctionAngleDeg = newAngle;
      float rad = correctionAngleDeg * (PI / 180.0);
      cosA = cos(rad);
      sinA = sin(rad);
      residualX = 0.0;
      residualY = 0.0;

      Serial.print("Aci guncellendi: ");
      Serial.print(correctionAngleDeg, 2);
      Serial.println(" derece");
    } else {
      Serial.println("Hata: Aci -45 ile +45 arasinda olmali");
    }
  } else if (input.startsWith("sens=") || input.startsWith("s=")) {
    int eqPos = input.indexOf('=');
    float newSens = input.substring(eqPos + 1).toFloat();

    if (newSens > 0.0 && newSens <= 5.0) {
      sensitivityMultiplier = newSens;
      Serial.print("Hassasiyet guncellendi: ");
      Serial.println(sensitivityMultiplier, 2);
    } else {
      Serial.println("Hata: Hassasiyet 0 ile 5 arasinda olmali");
    }
  } else if (input == "status" || input == "s") {
    Serial.println("--- Durum ---");
    Serial.print("Duzeltme acisi: ");
    Serial.print(correctionAngleDeg, 2);
    Serial.println(" derece");
    Serial.print("Hassasiyet: ");
    Serial.println(sensitivityMultiplier, 2);
    Serial.print("cos(a): ");
    Serial.println(cosA, 6);
    Serial.print("sin(a): ");
    Serial.println(sinA, 6);
    Serial.println("-------------");
  } else if (input == "help" || input == "h") {
    Serial.println("--- Komutlar ---");
    Serial.println("angle=<derece>  veya  a=<derece>  : Aciyi ayarla (-45..+45)");
    Serial.println("sens=<deger>    veya  s=<deger>   : Hassasiyeti ayarla (0..5)");
    Serial.println("status          veya  s           : Mevcut durumu goster");
    Serial.println("help            veya  h           : Bu mesaji goster");
    Serial.println("----------------");
  }
}

// ============================================================
// Arduino setup
// ============================================================
void setup() {
  Serial.begin(115200);

  // USB Host Shield'i baslat
  if (usb.Init() == -1) {
    Serial.println("HATA: USB Host Shield baslatilamadi!");
    Serial.println("Baglantilari kontrol edin ve tekrar deneyin.");
    while (1) {
      delay(1000);
    }
  }

  // Rotasyon matrisini onceden hesapla
  float rad = correctionAngleDeg * (PI / 180.0);
  cosA = cos(rad);
  sinA = sin(rad);

  // Leonardo dahili mouse HID'sini baslat
  Mouse.begin();

  // Mouse parser'i kaydet
  hidMouse.SetReportParser(0, &mouseParser);

  Serial.println("=== Mouse Aci Duzeltme Sistemi ===");
  Serial.print("Duzeltme acisi: ");
  Serial.print(correctionAngleDeg, 2);
  Serial.println(" derece");
  Serial.print("Hassasiyet: ");
  Serial.println(sensitivityMultiplier, 2);
  Serial.println("Aciyi degistirmek icin Serial Monitor'e 'angle=X' yazin");
  Serial.println("Yardim icin 'help' yazin");
  Serial.println("==================================");

  delay(200);
}

// ============================================================
// Arduino loop
// ============================================================
void loop() {
  usb.Task();
  checkSerialCommands();
}
