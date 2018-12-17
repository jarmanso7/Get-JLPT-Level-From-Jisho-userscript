// ==UserScript==
// @name         Get JLPT Level From Jisho
// @namespace    https://github.com/jarmanso7/Get-JLPT-Level-From-Jisho-userscript
// @version      0.1
// @description  Shows an alert containing the JLPT info for a given word obtained from jisho.org if available.
// @author       jarmanso7
// @match        http://*.memrise.com/*
// @match        https://*.memrise.com/*
// @grant        none
// ==/UserScript==

/*
 * Looks for the JLPT Info in the response provided by jisho.org
 */
function extractJLPTInfoFromJishoPage(jishoResultsHtmlString){

    var jishoResultsDoc;
    jishoResultsDoc = new DOMParser().parseFromString(jishoResultsHtmlString, "text/html");

    //document.getElementsByClassName("exact_block")[0].getElementsByClassName("concept_light clearfix")[0].getElementsByClassName("concept_light-tag label")[1].innerText.includes("jlpt",0)

    var thereIsAnExactMatch = existsAtLeastOneExactWordMatch(jishoResultsDoc);

    if (thereIsAnExactMatch){
        var firstExactMatch = jishoResultsDoc.getElementsByClassName("exact_block")[0];
        var JLPTInfo = getJLPTInfoIfExisting(firstExactMatch);

        if (JLPTInfo != null && JLPTInfo.length > 0){
            alert(JLPTInfo);
        }
    }
}

/*
 * Checks whether the resulting jisho page contains exact matches for the current word or not (rather than partial matches, which do not correspond to the actual definition of the word)
 */
function existsAtLeastOneExactWordMatch(doc){
    var exact_block = doc.getElementsByClassName("exact_block");

    if (exact_block.length > 0)
    {
        return true;
    }
    else
    {
        return false;
    }
}

/*
 * Returns an string containing the JLPT information if found. Returns null if the word does not have JLPT information or not
 */
function getJLPTInfoIfExisting(firstExactMatch){
    //There might be several <span class="concept_light clearfix"></span> tags corresponding to this word, either related or not to the JLPT level.
    var ArrayOfConceptLightClearfixSpanTags = firstExactMatch.getElementsByClassName("concept_light clearfix")[0].getElementsByClassName("concept_light-tag label");

    //A loop through all of them is required to look for the particular element containing JLPT info (it may or may not exist).
    for(var i = 0; i < ArrayOfConceptLightClearfixSpanTags.length; i++){
        var currentSpanContent = ArrayOfConceptLightClearfixSpanTags[i].innerText.toUpperCase();
        if(currentSpanContent.includes("JLPT",0)){
            return currentSpanContent;
        }
    }

    //return null if not found
    return null;
}


//Main function
(function() {
    'use strict';

    //Example: look up JLPT level for the word うち
    var url = "https://jisho.org/search/" + encodeURIComponent("うち")

    //Make use of a proxy to avoid CORS and request the results from jisho.org from any domain
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    fetch(proxyurl + url)
        .then(response => response.text())
        .then(contents => extractJLPTInfoFromJishoPage(contents))
        .catch((err) => alert(err))

})();
