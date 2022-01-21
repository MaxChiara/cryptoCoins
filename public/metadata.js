const data = [
    {"name":"rowCreator","desc": "Funzione che crea le righe della tabella in  base alla variabile Numrows", "children":[
                                        {"name":"loadHomeTabe","desc":"Chiamata fetch per recuperare i dati delle valute mostrate nella homepage", "colname":"level2", "children":
                                                    [{"name":"Node Fetch","desc":"chiamata fetch (usando la libreria Node Fetch) che chiede i dati all'api Coinmarket Cap" ,"colname":"level4", "children":
                                                        [{"name":"fs.WriteFile","desc":"Scrive i dati su un file Json" ,"colname":"level5", "children":
                                                            [{"name":"doneWriting","desc":"Al termine della scrittura dei dati viene propagato l'evento doneWriting" ,"colname":"level6", "children":
                                                                [{"name":"fs.ReadFile", "desc":"Il server rilegge i dati appena salvati su Json" , "colname":"level7", "children":
                                                                    [{"name":"Send response","desc":"Viene mandata la risposta al client" ,"colname":"level8", "children":
                                                                        [
                                                                            {"name":"compilaHomeTable","desc":"Popola la tabella con i dati", "colname":"level3"},
                                                                            {"name":"createIdList","desc":"Salva gli id delle valute caricate","colname":"level4"},
                                                                            {"name":"formatNumbers","desc":"Formatta i numeri della tabella","colname":"level4"},
                                                                            {"name":"formatValues","desc":"Crea un oggetto Intl.NumberFormat per i valori delle valute","colname":"level4"},
                                                                            {"name":"formatGreenRed","desc":"Colora di rosso i dati negativi e di verde quellli positivi","colname":"level4"},
                                                                            {"name":"addHref","colname":"level4"},
                                                                            {"name":"applyCanOrder","colname":"level4"},
                                                                            {"name":"visualizzaDatiScroller","colname":"level4"},
                                                                            {"name":"cryptoInfoWrapper","colname":"level4", "children":
                                                                                [
                                                                                    {"name":"addLogo","colname":"level5"}, 
                                                                                    {"name":"addArticles","colname":"level5"}
                                                                                ]
                                                                            }
                                                                        ]
                                                                    }]
                                                                }]
                                                            }]
                                                        }]
                                                    }]
                                        }
                                    ]
    },
    {
        "name":"index.html", "children":[
            {"name":"graph.html"},
            {"name":"meta.html"}
        ]
    }

]