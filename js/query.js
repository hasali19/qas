"use strict"

jQuery(function($) {
    $("#querySubmit").click(function() {
        processQuery($("#queryInput").val());
    });

    $(document).keydown(function(key) {
        if (key.which == 13) {
            processQuery($("#queryInput").val());
        }
    });

    async function processQuery(query) {
        /* Parse the query using pre-defined database of patterns data
         * Store data about query in queryData
         * Store list of required inputs in queryInputs
         * Update matched to true in case of match
         */
        var queryData;
        var queryInputs = [];
        var matched = false;
        for (var i in data) {
            if (matched) {
                break;
            }
            for (var j in data[i].patterns) {
                var reExp = data[i].patterns[j];
                if (reExp.test(query)) {
                    queryData = data[i];
                    queryInputs = reExp.exec(query).slice(1);
                    matched = true;
                    break;
                }
            }
        }
        /* Clear resultArea */
        $("#resultArea").text("");
        $("#resultArea").css("color", "black");
        /* Process the given type of query */
        switch (queryData.type) {
            case "who":
                var sparqlQuery = queryData.query.replace(queryData.inputs[0], queryInputs[0])
                var resultElem = $("<div></div>").addClass("result_elem");
                var success;
                try {
                    var response = await getWDResponse(sparqlQuery);
                    success = true;
                } catch (error) {
                    success = false;
                }
                if (success) {
                    /* API request succeeded */
                    var results = response.results.bindings;
                    if (results.length == 0) {
                        /* TODO: No match found - spellcheck */
                        resultElem.text("Unfortunately, your query did not match any items.")
                        $("#resultArea").append(resultElem);
                    } else {
                        var articleNames = [];
                        /* Fetch text extracts from Wikipedie (where applicable) */
                        for (var result in results) {
                            if (results[result].article != null) {
                                articleNames[result] = decodeURI(results[result].article.value);
                                articleNames[result] = articleNames[result].replace("https://en.wikipedia.org/wiki/", "");
                                articleNames[result] = articleNames[result].replace(/_/g, " ");
                            }
                        }
                        console.log(articleNames);
                        var extracts = await getWPExtracts(articleNames);
                        console.log(extracts);
                        var previous;
                        for (var result in results) {
                            if (results[result].person.value != previous) {
                                if (extracts[result] != null) {
                                    resultElem.html(extracts[result]);
                                } else {
                                    var name = results[result].personLabel.value;
                                    var description = results[result].personDescription.value;
                                    if (results[result].died == null) {
                                        resultElem.text(name + " is " + description);
                                    } else {
                                        resultElem.text(name + " was " + description);
                                    }
                                }
                                previous = results[result].person.value;
                            }
                            $("#resultArea").append(resultElem);
                            resultElem = $("<div></div>").addClass("result_elem");
                        }
                    }
                } else {
                    /* API request failed - display error message */
                    resultElem.text("Unable to load data from API, please check your internet "
                        + "connection and try again later.");
                    resultElem.css("color", "red");
                    $("#resultArea").append(resultElem);
                }
                break;
        }
    }

    function getWDResponse(sparqlQuery) {
        return new Promise(function(resolve, reject) {
            $.ajax({
                type: 'POST',
                url: "https://query.wikidata.org/sparql",
                data: {
                    query: sparqlQuery,
                    format: 'json'
                },
                dataType: 'json',
                timeout: 5000,
                success: function(jsondata) {
                    resolve(jsondata);
                },
                error: function() {
                    reject();
                }
            });
        });
    }

    function getWPExtracts(titles) {
        var filteredTitles = titles.filter(function(elem) {
            return elem != null;
        });
        var joinedTitles = filteredTitles.join("|");
        return new Promise(function(resolve, reject) {
            $.ajax({
    			type: 'POST',
    			url: "https://en.wikipedia.org/w/api.php",
    			data: {
    				format: 'json',
    				action: 'query',
    				prop: 'extracts',
    				exintro: '1',
    				exlimit: '20',
    				exsectionformat: 'plain',
    				titles: joinedTitles,
    				origin: '*'
    			},
    			dataType: 'json',
    			timeout: 5000,
    			success: function(jsondata) {
                    var extracts = [];
                    for (var i = 0; i < titles.length; i++) {
                        for (var page in jsondata.query.pages) {
                            if (jsondata.query.pages[page].title == titles[i]) {
                                extracts[i] = jsondata.query.pages[page].extract;
                            }
                        }
                    }
                    resolve(extracts);
                },
                error: function() {
                    reject();
                }
            });
        });
    }
});
