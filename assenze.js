/* =========================================================
   PERIODI DI ASSENZA – il pulsante "Chiama" del sito resta spento
   ---------------------------------------------------------
   Scrivi una riga per ogni periodo, con le date nel formato
   "AAAA-MM-GG" (anno-mese-giorno). Le date sono comprese:
   dal primo all'ultimo giorno il pulsante è spento.

   Esempio (togli le due barre // all'inizio per attivarlo):
   // {dal:"2026-12-10", al:"2026-12-17"},

   Finito il periodo puoi lasciare la riga: viene ignorata da sola.
   ========================================================= */

window.BERTI_ASSENZE = [
  {dal:"2026-12-10", al:"2026-12-12"},

];

/* =========================================================
   ORARI SPECIALI — per singole date, al posto dell'orario normale
   ---------------------------------------------------------
   Una riga per giorno: data "AAAA-MM-GG", orari "HH:MM".
   Il pulsante "Chiama" è acceso solo tra "dalle" e "alle".
   Per spegnerlo tutto il giorno usa BERTI_ASSENZE qui sopra.
   Finito il giorno puoi lasciare la riga: viene ignorata da sola.
   ========================================================= */

window.BERTI_ORARI_SPECIALI = [
  {data:"2026-12-24", dalle:"08:00", alle:"12:00"},
  {data:"2026-12-26", dalle:"08:00", alle:"22:30"},

];
