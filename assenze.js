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

/* =========================================================
   AVVISI — compaiono nella sezione Contatti del sito
   solo tra la data "dal" e la data "al" (comprese).
   Una riga per avviso. Finito il periodo spariscono da soli.
   ========================================================= */

window.BERTI_AVVISI = [
  {dal:"2026-12-01", al:"2026-12-12", testo:"Chiuso per ferie da giovedì 10 a sabato 12 dicembre: puoi scrivermi su WhatsApp o lasciare una richiesta, ti rispondo da lunedì 14."},
  {dal:"2026-12-01", al:"2027-01-06", testo:"Durante le feste intervengo anche nei giorni festivi (25, 26 e 31 dicembre, 1 e 6 gennaio) dalle 8:00 alle 22:30. Il 24 dicembre solo fino alle 12:00."},

];
