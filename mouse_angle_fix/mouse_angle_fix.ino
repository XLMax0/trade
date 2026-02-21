#include <SPI.h>
#include <hidboot.h>
#include <usbhub.h>
#include <Mouse.h>
#include <Keyboard.h>
#if !defined(ARDUINO_AVR_LEONARDO) && !defined(ARDUINO_AVR_MICRO) && !defined(ARDUINO_AVR_YUN)
#error "Wrong Board! Select Arduino Leonardo or Micro."
#endif
USB     Usb;
USBHub  Hub(&Usb);
HIDBoot<USB_HID_PROTOCOL_MOUSE> HidMouse(&Usb);
bool systemActive  = false;
bool leftHeld      = false;
int  activeProfile = 0;

// ── Aci Duzeltme Ayarlari ──
// Pozitif = mouse saga yanik (saat yonu), Negatif = sola yanik
// Goruntuden tahmini ~7 derece. Ince ayar icin degistirin.
float correctionAngleDeg = 7.0;
float cosA = 1.0;
float sinA = 0.0;
float residualX = 0.0;
float residualY = 0.0;

// Profiles:
//   0: AK47  →  Side Fwd
//   1: M4A1-S  →  Side Back
void delayCheck(uint16_t ms) {
    uint32_t t = millis();
    while (millis()-t < ms) { Usb.Task(); if (!leftHeld) return; }
}
// ── Profile 0: AK47 ──
void macro_0() {
    Mouse.move(constrain(0,-127,127), constrain(2,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(0,-127,127), constrain(1,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(0,-127,127), constrain(2,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(0,-127,127), constrain(1,-127,127), 0);
    delayCheck(13); if (!leftHeld) return;
    Mouse.move(constrain(0,-127,127), constrain(6,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(0,-127,127), constrain(6,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(0,-127,127), constrain(6,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(0,-127,127), constrain(6,-127,127), 0);
    delayCheck(25); if (!leftHeld) return;
    Mouse.move(constrain(0,-127,127), constrain(10,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(0,-127,127), constrain(10,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(0,-127,127), constrain(10,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(0,-127,127), constrain(10,-127,127), 0);
    delayCheck(25); if (!leftHeld) return;
    Mouse.move(constrain(0,-127,127), constrain(10,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(0,-127,127), constrain(10,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(0,-127,127), constrain(10,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(0,-127,127), constrain(10,-127,127), 0);
    delayCheck(25); if (!leftHeld) return;
    Mouse.move(constrain(3,-127,127), constrain(9,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(3,-127,127), constrain(9,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(3,-127,127), constrain(9,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(3,-127,127), constrain(9,-127,127), 0);
    delayCheck(25); if (!leftHeld) return;
    Mouse.move(constrain(3,-127,127), constrain(9,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(3,-127,127), constrain(9,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(3,-127,127), constrain(9,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(3,-127,127), constrain(9,-127,127), 0);
    delayCheck(25); if (!leftHeld) return;
    Mouse.move(constrain(5,-127,127), constrain(5,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(5,-127,127), constrain(5,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(5,-127,127), constrain(5,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(5,-127,127), constrain(5,-127,127), 0);
    delayCheck(25); if (!leftHeld) return;
    Mouse.move(constrain(-5,-127,127), constrain(7,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(-5,-127,127), constrain(7,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(-5,-127,127), constrain(7,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(-5,-127,127), constrain(7,-127,127), 0);
    delayCheck(25); if (!leftHeld) return;
    Mouse.move(constrain(-15,-127,127), constrain(-2,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(-15,-127,127), constrain(-2,-127,127), 0);
    delayCheck(12); if (!leftHeld) return;
    Mouse.move(constrain(-15,-127,127), constrain(-2,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(-15,-127,127), constrain(-2,-127,127), 0);
    delayCheck(25); if (!leftHeld) return;
    Mouse.move(constrain(-6,-127,127), constrain(2,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(-6,-127,127), constrain(2,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(-6,-127,127), constrain(2,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(-6,-127,127), constrain(2,-127,127), 0);
    delayCheck(25); if (!leftHeld) return;
    Mouse.move(constrain(3,-127,127), constrain(1,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(3,-127,127), constrain(1,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(3,-127,127), constrain(1,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(3,-127,127), constrain(1,-127,127), 0);
    delayCheck(25); if (!leftHeld) return;
    Mouse.move(constrain(-3,-127,127), constrain(1,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(-3,-127,127), constrain(1,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(-3,-127,127), constrain(1,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(-3,-127,127), constrain(1,-127,127), 0);
    delayCheck(25); if (!leftHeld) return;
    Mouse.move(constrain(-8,-127,127), constrain(1,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(-8,-127,127), constrain(1,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(-8,-127,127), constrain(1,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(-8,-127,127), constrain(1,-127,127), 0);
    delayCheck(25); if (!leftHeld) return;
    Mouse.move(constrain(0,-127,127), constrain(1,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(0,-127,127), constrain(1,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(0,-127,127), constrain(1,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(0,-127,127), constrain(1,-127,127), 0);
    delayCheck(25); if (!leftHeld) return;
    Mouse.move(constrain(10,-127,127), constrain(1,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(10,-127,127), constrain(1,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(10,-127,127), constrain(1,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(10,-127,127), constrain(1,-127,127), 0);
    delayCheck(25); if (!leftHeld) return;
    Mouse.move(constrain(6,-127,127), constrain(0,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(6,-127,127), constrain(0,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(6,-127,127), constrain(0,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(6,-127,127), constrain(0,-127,127), 0);
    delayCheck(25); if (!leftHeld) return;
    Mouse.move(constrain(5,-127,127), constrain(4,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(5,-127,127), constrain(4,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(5,-127,127), constrain(4,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(5,-127,127), constrain(4,-127,127), 0);
    delayCheck(25); if (!leftHeld) return;
    Mouse.move(constrain(9,-127,127), constrain(0,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(9,-127,127), constrain(0,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(9,-127,127), constrain(0,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(9,-127,127), constrain(0,-127,127), 0);
    delayCheck(25); if (!leftHeld) return;
    Mouse.move(constrain(9,-127,127), constrain(-4,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(9,-127,127), constrain(-4,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(9,-127,127), constrain(-4,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(9,-127,127), constrain(-4,-127,127), 0);
    delayCheck(25); if (!leftHeld) return;
    Mouse.move(constrain(-6,-127,127), constrain(0,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(-6,-127,127), constrain(0,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(-6,-127,127), constrain(0,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(-6,-127,127), constrain(0,-127,127), 0);
    delayCheck(25); if (!leftHeld) return;
    Mouse.move(constrain(2,-127,127), constrain(0,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(2,-127,127), constrain(0,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(2,-127,127), constrain(0,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(2,-127,127), constrain(0,-127,127), 0);
    delayCheck(25); if (!leftHeld) return;
    Mouse.move(constrain(-2,-127,127), constrain(2,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(-2,-127,127), constrain(2,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(-2,-127,127), constrain(2,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(-2,-127,127), constrain(2,-127,127), 0);
    delayCheck(25); if (!leftHeld) return;
    Mouse.move(constrain(-1,-127,127), constrain(2,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(-1,-127,127), constrain(2,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(-1,-127,127), constrain(2,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(-1,-127,127), constrain(2,-127,127), 0);
    delayCheck(25); if (!leftHeld) return;
    Mouse.move(constrain(3,-127,127), constrain(1,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(3,-127,127), constrain(1,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(3,-127,127), constrain(1,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(3,-127,127), constrain(1,-127,127), 0);
    delayCheck(25); if (!leftHeld) return;
    Mouse.move(constrain(1,-127,127), constrain(1,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(1,-127,127), constrain(1,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(1,-127,127), constrain(1,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(1,-127,127), constrain(1,-127,127), 0);
    delayCheck(25); if (!leftHeld) return;
    Mouse.move(constrain(-4,-127,127), constrain(0,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(-4,-127,127), constrain(0,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(-4,-127,127), constrain(0,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(-4,-127,127), constrain(0,-127,127), 0);
    delayCheck(25); if (!leftHeld) return;
    Mouse.move(constrain(-10,-127,127), constrain(0,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(-10,-127,127), constrain(0,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(-10,-127,127), constrain(0,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(-10,-127,127), constrain(0,-127,127), 0);
    delayCheck(25); if (!leftHeld) return;
    Mouse.move(constrain(-12,-127,127), constrain(-4,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(-12,-127,127), constrain(-4,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(-12,-127,127), constrain(-4,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(-12,-127,127), constrain(-4,-127,127), 0);
    delayCheck(25); if (!leftHeld) return;
    Mouse.move(constrain(-6,-127,127), constrain(-3,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(-6,-127,127), constrain(-3,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(-6,-127,127), constrain(-3,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(-6,-127,127), constrain(-3,-127,127), 0);
    delayCheck(120); if (!leftHeld) return;
    Mouse.move(constrain(0,-127,127), constrain(1,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
}
// ── Profile 1: M4A1-S ──
void macro_1() {
    Mouse.move(constrain(0,-127,127), constrain(1,-127,127), 0);
    delayCheck(12); if (!leftHeld) return;
    Mouse.move(constrain(0,-127,127), constrain(1,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(0,-127,127), constrain(1,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(0,-127,127), constrain(1,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(0,-127,127), constrain(1,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(0,-127,127), constrain(1,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(0,-127,127), constrain(1,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(0,-127,127), constrain(1,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(0,-127,127), constrain(1,-127,127), 0);
    delayCheck(25); if (!leftHeld) return;
    Mouse.move(constrain(0,-127,127), constrain(3,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(0,-127,127), constrain(3,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(0,-127,127), constrain(3,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(0,-127,127), constrain(3,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(0,-127,127), constrain(6,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(0,-127,127), constrain(6,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(0,-127,127), constrain(6,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(0,-127,127), constrain(6,-127,127), 0);
    delayCheck(25); if (!leftHeld) return;
    Mouse.move(constrain(0,-127,127), constrain(6,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(0,-127,127), constrain(6,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(0,-127,127), constrain(6,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(0,-127,127), constrain(6,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(-1,-127,127), constrain(7,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(-1,-127,127), constrain(7,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(-1,-127,127), constrain(7,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(-1,-127,127), constrain(7,-127,127), 0);
    delayCheck(25); if (!leftHeld) return;
    Mouse.move(constrain(3,-127,127), constrain(4,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(3,-127,127), constrain(4,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(3,-127,127), constrain(4,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(3,-127,127), constrain(4,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(2,-127,127), constrain(3,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(2,-127,127), constrain(3,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(2,-127,127), constrain(3,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(2,-127,127), constrain(3,-127,127), 0);
    delayCheck(25); if (!leftHeld) return;
    Mouse.move(constrain(4,-127,127), constrain(0,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(4,-127,127), constrain(0,-127,127), 0);
    delayCheck(12); if (!leftHeld) return;
    Mouse.move(constrain(4,-127,127), constrain(0,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(4,-127,127), constrain(0,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(0,-127,127), constrain(2,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(0,-127,127), constrain(2,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(0,-127,127), constrain(2,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(0,-127,127), constrain(2,-127,127), 0);
    delayCheck(25); if (!leftHeld) return;
    Mouse.move(constrain(-4,-127,127), constrain(3,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(-4,-127,127), constrain(3,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(-4,-127,127), constrain(3,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(-4,-127,127), constrain(3,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(-7,-127,127), constrain(-1,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(-7,-127,127), constrain(-1,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(-7,-127,127), constrain(-1,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(-7,-127,127), constrain(-1,-127,127), 0);
    delayCheck(25); if (!leftHeld) return;
    Mouse.move(constrain(-6,-127,127), constrain(0,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(-6,-127,127), constrain(0,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(-6,-127,127), constrain(0,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(-6,-127,127), constrain(0,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(-5,-127,127), constrain(-2,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(-5,-127,127), constrain(-2,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(-5,-127,127), constrain(-2,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(-5,-127,127), constrain(-2,-127,127), 0);
    delayCheck(121); if (!leftHeld) return;
    Mouse.move(constrain(4,-127,127), constrain(1,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(4,-127,127), constrain(1,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(4,-127,127), constrain(1,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(4,-127,127), constrain(1,-127,127), 0);
    delayCheck(25); if (!leftHeld) return;
    Mouse.move(constrain(-4,-127,127), constrain(0,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(-4,-127,127), constrain(0,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(-4,-127,127), constrain(0,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(-4,-127,127), constrain(0,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(-3,-127,127), constrain(0,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(-3,-127,127), constrain(0,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(-3,-127,127), constrain(0,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(-3,-127,127), constrain(0,-127,127), 0);
    delayCheck(121); if (!leftHeld) return;
    Mouse.move(constrain(10,-127,127), constrain(0,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(10,-127,127), constrain(0,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(10,-127,127), constrain(0,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(10,-127,127), constrain(0,-127,127), 0);
    delayCheck(25); if (!leftHeld) return;
    Mouse.move(constrain(1,-127,127), constrain(2,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(1,-127,127), constrain(2,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(1,-127,127), constrain(2,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(1,-127,127), constrain(2,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(7,-127,127), constrain(0,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(7,-127,127), constrain(0,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(7,-127,127), constrain(0,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(7,-127,127), constrain(0,-127,127), 0);
    delayCheck(25); if (!leftHeld) return;
    Mouse.move(constrain(1,-127,127), constrain(0,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(1,-127,127), constrain(0,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(1,-127,127), constrain(0,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(1,-127,127), constrain(0,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(2,-127,127), constrain(0,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(2,-127,127), constrain(0,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(2,-127,127), constrain(0,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
    Mouse.move(constrain(2,-127,127), constrain(0,-127,127), 0);
    delayCheck(120); if (!leftHeld) return;
    Mouse.move(constrain(0,-127,127), constrain(1,-127,127), 0);
    delayCheck(24); if (!leftHeld) return;
}
void runActiveProfile() {
    switch (activeProfile) {
        case 0: macro_0(); break; // AK47
        case 1: macro_1(); break; // M4A1-S
    }
}
class MouseRptParser : public MouseReportParser {
public:
    uint8_t *raw; uint8_t oldButtons;
    MouseRptParser() : oldButtons(0), raw(NULL) {}
    void Parse(USBHID *hid, bool is_rpt_id, uint8_t len, uint8_t *buf) override {
        raw = buf;
        uint8_t buttons = buf[0], changed = buttons ^ oldButtons;
        if ((changed&1)  && (buttons&1))  OnLeftButtonDown(NULL);
        if ((changed&1)  &&!(buttons&1))  OnLeftButtonUp(NULL);
        if ((changed&2)  && (buttons&2))  OnRightButtonDown(NULL);
        if ((changed&2)  &&!(buttons&2))  OnRightButtonUp(NULL);
        if ((changed&4)  && (buttons&4))  OnMiddleButtonDown(NULL);
        if ((changed&4)  &&!(buttons&4))  OnMiddleButtonUp(NULL);
        if ((changed&8)  && (buttons&8))  OnMouse4Down();
        if ((changed&8)  &&!(buttons&8))  OnMouse4Up();
        if ((changed&16) && (buttons&16)) OnMouse5Down();
        if ((changed&16) &&!(buttons&16)) OnMouse5Up();
        oldButtons = buttons;
        OnMouseMove(NULL);
    }
    void OnMouseMove(MOUSEINFO *mi) override {
        if (!raw) return;
        int16_t x16=(int16_t)(raw[1]|(raw[2]<<8)), y16=(int16_t)(raw[3]|(raw[4]<<8));
        int8_t scroll=(int8_t)raw[5];

        // ── Aci Duzeltme (Rotasyon Matrisi) ──
        float fx = (float)x16 * cosA + (float)y16 * sinA;
        float fy = (float)(-x16) * sinA + (float)y16 * cosA;
        fx += residualX;
        fy += residualY;
        int16_t corrX = (int16_t)fx;
        int16_t corrY = (int16_t)fy;
        residualX = fx - corrX;
        residualY = fy - corrY;

        int8_t sx=constrain(corrX,-127,127), sy=constrain(corrY,-127,127);
        if (sx||sy||scroll) Mouse.move(sx,sy,scroll);
    }
    void OnLeftButtonDown(MOUSEINFO *mi) { Mouse.press(MOUSE_LEFT);   leftHeld=true;  }
    void OnLeftButtonUp(MOUSEINFO *mi)   { Mouse.release(MOUSE_LEFT); leftHeld=false; }
    void OnRightButtonDown(MOUSEINFO *mi){ Mouse.press(MOUSE_RIGHT);  }
    void OnRightButtonUp(MOUSEINFO *mi)  { Mouse.release(MOUSE_RIGHT);}
    void OnMiddleButtonDown(MOUSEINFO *mi) {
        Mouse.press(MOUSE_MIDDLE);
        systemActive = !systemActive;
    }
    void OnMiddleButtonUp(MOUSEINFO *mi) { Mouse.release(MOUSE_MIDDLE); }
    void OnMouse4Down() {
        activeProfile = 1; // M4A1-S
    }
    void OnMouse4Up() {
    }
    void OnMouse5Down() {
        activeProfile = 0; // AK47
    }
    void OnMouse5Up() {
    }
};
MouseRptParser Prs;
void setup() {
    // Rotasyon matrisini hesapla
    float rad = correctionAngleDeg * (PI / 180.0);
    cosA = cos(rad);
    sinA = sin(rad);

    Mouse.begin(); Keyboard.begin(); Usb.Init(); HidMouse.SetReportParser(0,&Prs);
}
void loop() {
    Usb.Task();
    if (leftHeld && systemActive) runActiveProfile();
}
