URL: https://glacial-meadow-11946.herokuapp.com/

Questa applicazione serve a visualizzare velocemente diversi dati relativi alle attuali criptovalute e guardare l’andamento generale con l’aiuto di un grafico.

Tecnologie usate: Front end: html, css, Javascript, D3. Back end: Node.js

Flusso dei dati: Il client non chiede i dati direttamente alle api, in quanto alcune api richiedono l’uso di una chiave da includere nella chiamata. Se questa chiamata fosse fatta in javascript direttamente dal lato client la chiave sarebbe quindi pubblicamente visibile. Per questo motivo le richieste del client vengono passate al server, che effettua le chiamate alle api e salva di dati ottenuti in files json. Il server dopodiché legge i dati appena salvati e li manda al client. I dati vengono ottenuti in tempo reale e vengono immediatamente visualizzati, in quanto non necessitano di ulteriori trasformazioni. I costi per l’ottenimento dei dati dipendono dal traffico che l’applicazione deve essere in grado di sopportare e dal livello di dettaglio che si vuole raggiungere nei grafici. Al momento l’applicazione non ha costi per il reperimento dei dati, ma questo implica dei limiti nella quantità di dati che è possibile richiedere e nel livello di dettaglio del grafico delle singole valute.
