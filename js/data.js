"use strict"

var aliases = {
    0: {
        pattern: /who\s+directed\s+(.+?)\??$/i,
        inputs: {
            0: "$1"
        },
        query: "who is the director of $1"
    },
    1: {
        pattern: /who\s+owns\s+(.+?)\??$/i,
        inputs: {
            0: "$1"
        },
        query: "who is the owner of $1"
    },
    2: {
        pattern: /how\s+many\s+people\s+live\s+in\s+(.+?)\??$/i,
        inputs: {
            0: "$1"
        },
        query: "what is the population of $1"
    },
    3: {
        pattern: /who\s+founded\s+(.+?)\??$/i,
        inputs: {
            0: "$1"
        },
        query: "who is the founder of $1"
    },
    4: {
        pattern: /who\s+composed\s+music\s+(?:of|for)\s+(.+?)\??$/i,
        inputs: {
            0: "$1"
        },
        query: "who is the composer of $1"
    },
    5: {
        pattern: /who\s+wrote\s*(?:the)\s+script\s+(?:for|of)\s+(.+?)\??$/i,
        inputs: {
            0: "$1"
        },
        query: "who is the screenwriter of $1"
    },
    6: {
        pattern: /who\s+compsed\s+(.+?)\??$/i,
        inputs: {
            0: "$1"
        },
        query: "who is the composer of $1"
    },
    7: {
        pattern: /who\s+wrote\s+(.+?)\??$/i,
        inputs: {
            0: "$1"
        },
        query: "who is the author of $1"
    }
}

var data = {
    0: {
        type: "genericWdNoBody",
        patterns: {
            0: /when\s+was\s+(.+?)\s+born\??$/i,
            1: /what\s+is\s+the\s+date\s+of\s+birth\s+of\s+(.+?)\??$/i
        },
        inputs: {
            0: "$searchedObject"
        },
        replacements: {
            0: "born"
        },
        replacementTypes: {
            0: "date"
        },
        header: "$searchedObject was born on $born.",
        query: `
            SELECT ?object ?objectLabel ?objectDescription ?article ?born ?picture (COUNT(DISTINCT ?sitelink) AS ?count) WHERE {
              ?object rdfs:label|skos:altLabel "$searchedObject"@en .
              ?object wdt:P569 ?born .
              OPTIONAL {
                ?article schema:isPartOf <https://en.wikipedia.org/>;
                  schema:about ?object.
              }
              OPTIONAL {
                ?sitelink schema:about ?object .
              }
              OPTIONAL {
                ?object wdt:P18 ?picture .
              }
              SERVICE wikibase:label {
                bd:serviceParam wikibase:language "en" .
              }
              FILTER NOT EXISTS{?object wdt:P31 wd:Q4167410}
              FILTER NOT EXISTS{?object wdt:P31/wdt:P279* wd:Q18616576}
            }
            GROUP BY ?object ?objectLabel ?objectDescription ?article ?born ?picture
            ORDER BY DESC(?count)`
    },
    1: {
        type: "genericWdNoBody",
        patterns: {
            0: /when\s+did\s+(.+?)\s+die\??$/i,
            1: /what\s+is\s+the\s+date\s+of\s+death\s+of\s+(.+?)\??$/i
        },
        inputs: {
            0: "$searchedObject"
        },
        replacements: {
            0: "died"
        },
        replacementTypes: {
            0: "date"
        },
        header: "$searchedObject died on $died.",
        query: `
            SELECT ?object ?objectLabel ?objectDescription ?article ?died ?picture (COUNT(DISTINCT ?sitelink) AS ?count) WHERE {
              ?object rdfs:label|skos:altLabel "$searchedObject"@en .
              ?object wdt:P570 ?died .
              OPTIONAL {
                ?article schema:isPartOf <https://en.wikipedia.org/>;
                  schema:about ?object.
              }
              OPTIONAL {
                ?sitelink schema:about ?object .
              }
              OPTIONAL {
                ?object wdt:P18 ?picture .
              }
              SERVICE wikibase:label {
                bd:serviceParam wikibase:language "en" .
              }
              FILTER NOT EXISTS{?object wdt:P31 wd:Q4167410}
              FILTER NOT EXISTS{?object wdt:P31/wdt:P279* wd:Q18616576}
            }
            GROUP BY ?object ?objectLabel ?objectDescription ?article ?died ?picture
            ORDER BY DESC(?count)`
    },
    2: {
        type: "genericWdBody",
        patterns: {
            0: /play\s+(.+?)$/i,
            1: /please\s+play\s+(.+?)$/i,
            2: /find\s+video\s+of\s+(.+?)$/i,
            3: /play\s+video\s+of\s+(.+?)$/i
        },
        inputs: {
            0: "$searchedObject"
        },
        replacements: {
            0: "youtubeId"
        },
        replacementTypes: {
            0: "string"
        },
        body: `<div class="row"><div style="height: 0; padding-bottom: 56.25%; position: relative;"><iframe src="https://www.youtube.com/embed/$youtubeId?autoplay=1"
              frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope;
              picture-in-picture" style="width: 100%; height: 100%; position: absolute;" allowfullscreen></iframe></div></div>`,
        query: `
            SELECT ?object ?objectLabel ?objectDescription ?youtubeId (COUNT(DISTINCT ?sitelink) AS ?count) WHERE {
              ?object rdfs:label|skos:altLabel "$searchedObject"@en .
              ?object wdt:P1651 ?youtubeId .
              OPTIONAL {
                ?article schema:isPartOf <https://en.wikipedia.org/>;
                  schema:about ?object.
              }
              OPTIONAL {
                ?sitelink schema:about ?object .
              }
              OPTIONAL {
                ?object wdt:P18 ?picture .
              }
              SERVICE wikibase:label {
                bd:serviceParam wikibase:language "en" .
              }
              FILTER NOT EXISTS{?object wdt:P31 wd:Q4167410}
              FILTER NOT EXISTS{?object wdt:P31/wdt:P279* wd:Q18616576}
            }
            GROUP BY ?object ?objectLabel ?objectDescription ?youtubeId
            ORDER BY DESC(?count)`
    },
    3: {
        type: "genericWdBody",
        patterns: {
            0: /(?:please)?\s*show\s*(?:me)?\s*(?:the)?\s+logo\s+(?:of)?\s*(.+?)$/i
        },
        inputs: {
            0: "$searchedObject"
        },
        replacements: {
            0: "logo"
        },
        replacementTypes: {
            0: "string"
        },
        body: `<div style="text-align: center"><img src=$logo width="70%" alt="Logo of searched object"></div>`,
        query: `
            SELECT ?object ?objectLabel ?objectDescription ?logo (COUNT(DISTINCT ?sitelink) AS ?count) WHERE {
              ?object rdfs:label|skos:altLabel "$searchedObject"@en .
              ?object wdt:P154 ?logo .
              OPTIONAL {
                ?sitelink schema:about ?object .
              }
              SERVICE wikibase:label {
                bd:serviceParam wikibase:language "en" .
              }
              FILTER NOT EXISTS{?object wdt:P31 wd:Q4167410}
              FILTER NOT EXISTS{?object wdt:P31/wdt:P279* wd:Q18616576}
            }
            GROUP BY ?object ?objectLabel ?objectDescription ?logo
            ORDER BY DESC(?count)`
    },
    4: {
        type: "news",
        patterns: {
          0: /tell (?:me the|me) (.+?) (?:from|of) (.+?)\.?$/i,
          1: /what (?:are the|are) (.+?) (?:from) (.+?)\??$/i,
          2: /show (?:me the|me|the) (.+?) (?:from|of) (.+?)\.?$/i,
          3: /show (.+?) (?:from|of) (.+?)\.?$/i,
        },
        inputs: {
          0: "$ntype",
          1: "$nsource"
        }
    },
    5: {
        type: "genericWdBody",
        patterns: {
            0: /(?:please)?\s*show\s*(?:me)?\s*(?:the)?\s*(?:picture)?\s*(?:of)?\s*(.+?)$/i
        },
        inputs: {
            0: "$searchedObject"
        },
        replacements: {
            0: "picture"
        },
        replacementTypes: {
            0: "string"
        },
        body: `<div style="text-align: center"><img src=$picture width="70%" alt="Picture of searched object"></div>`,
        query: `
            SELECT ?object ?objectLabel ?objectDescription ?picture (COUNT(DISTINCT ?sitelink) AS ?count) WHERE {
              ?object rdfs:label|skos:altLabel "$searchedObject"@en .
              ?object wdt:P18 ?picture .
              OPTIONAL {
                ?article schema:isPartOf <https://en.wikipedia.org/>;
                  schema:about ?object.
              }
              OPTIONAL {
                ?sitelink schema:about ?object .
              }
              OPTIONAL {
                ?object wdt:P18 ?picture .
              }
              SERVICE wikibase:label {
                bd:serviceParam wikibase:language "en" .
              }
              FILTER NOT EXISTS{?object wdt:P31 wd:Q4167410}
              FILTER NOT EXISTS{?object wdt:P31/wdt:P279* wd:Q18616576}
            }
            GROUP BY ?object ?objectLabel ?objectDescription ?picture
            ORDER BY DESC(?count)`
    },
    6: {
        type: "wOfWhat",
        patterns: {
            0: /(?:what|who|when)\s+(?:are|is|was)\s+(?:the)?\s*(.+?)\s+of\s*(?:the)?\s+(.+?)\??$/i,
            1: /(.+?)\s+of\s*(?:the)?\s+(.+?)\??$/i,
        },
        inputs: {
            0: "$searchedObject"
        },
        replacement: "resultLabel",
        header: "$resultLabel $be the $propertyNum of $searchedObject.",
        options: {
            0: "$be",
            1: "$propertyNum"
        },
        singulars: {
            0: "is"
        },
        plurals: {
            0: "are",
        },
        replaceValues: {
            0: "owned by",
            1: "founded by",
            2: "childs"
        },
        replaceBy: {
            0: "owner",
            1: "founder",
            2: "children"
        },
        query: `
            SELECT ?object ?objectLabel ?objectDescription ?result ?resultLabel (COUNT(DISTINCT ?sitelink) AS ?count) WHERE {
              ?object rdfs:label|skos:altLabel "$searchedObject"@en .
              ?object wdt:$property ?result .
              OPTIONAL {
                ?sitelink schema:about ?object .
              }
              SERVICE wikibase:label {
                bd:serviceParam wikibase:language "en" .
              }
              FILTER NOT EXISTS{?object wdt:P31 wd:Q4167410}
              FILTER NOT EXISTS{?object wdt:P31/wdt:P279* wd:Q18616576}
            }
            GROUP BY ?object ?objectLabel ?objectDescription ?result ?resultLabel
            ORDER BY DESC(?count)`
    },
    7: {
        type: "whoOrWhat",
        patterns: {
            0: /who\s+is\s+(.+?)\??$/i,
            1: /who\s+was\s+(.+?)\??$/i
        },
        inputs: {
            0: "$searchedObject"
        },
        query: `
            SELECT ?object ?objectLabel ?objectDescription ?article ?ended ?picture (COUNT(DISTINCT ?sitelink) AS ?count) WHERE {
              ?object rdfs:label|skos:altLabel "$searchedObject"@en .
              OPTIONAL {
                ?article schema:isPartOf <https://en.wikipedia.org/>;
                  schema:about ?object.
              }
              OPTIONAL {
                ?object wdt:P570 ?ended .
              }
              OPTIONAL {
                ?sitelink schema:about ?object .
              }
              OPTIONAL {
                ?object wdt:P18 ?picture .
              }
              SERVICE wikibase:label {
                bd:serviceParam wikibase:language "en" .
              }
              {FILTER EXISTS{?object wdt:P31 wd:Q5}}
              UNION
              {FILTER EXISTS{?object wdt:P31/wdt:P279* wd:Q95074}}
            }
            GROUP BY ?object ?objectLabel ?objectDescription ?article ?ended ?picture
            ORDER BY DESC(?count)`
    },
    8: {
        type: "whoOrWhat",
        patterns: {
            0: /what\s+is\s+a\s+(.+?)\??$/i,
            1: /what\s+is\s+(.+?)\??$/i,
            2: /what\s+was\s+(.+?)\??$/i
        },
        inputs: {
            0: "$searchedObject"
        },
        query: `
            SELECT ?object ?objectLabel ?objectDescription ?article ?ended ?picture (COUNT(DISTINCT ?sitelink) AS ?count) WHERE {
              ?object rdfs:label|skos:altLabel "$searchedObject"@en .
              OPTIONAL {
                ?article schema:isPartOf <https://en.wikipedia.org/>;
                  schema:about ?object.
              }
              OPTIONAL {
                ?object wdt:P576 ?ended .
              }
              OPTIONAL {
                ?sitelink schema:about ?object .
              }
              OPTIONAL {
                ?object wdt:P18 ?picture .
              }
              SERVICE wikibase:label {
                bd:serviceParam wikibase:language "en" .
              }
              FILTER NOT EXISTS{?object wdt:P31 wd:Q5}
              FILTER NOT EXISTS{?object wdt:P31 wd:Q4167410}
              FILTER NOT EXISTS{?object wdt:P31/wdt:P279* wd:Q18616576}
            }
            GROUP BY ?object ?objectLabel ?objectDescription ?article ?ended ?picture
            ORDER BY DESC(?count)`
    }
}
