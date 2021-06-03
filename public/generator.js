/**
 * JSON-generator for Tiedonhaun tehtävälomake
 *
 * An exception to copyright / licence below, the escapeRegExp-method. See it's comments for more. 
 *
 * @copyright 2014 Tampereen Kaupunginkirjasto - Pirkanmaan maakuntakirjasto
 * @licence MIT License, see LICENCE-file for more.
 */
(function() {
    // Following escapeRegExp-method is public domain / CC0 according the MDN info page
    // If there's any licensing issues, remove this and implement it yourself : )
    // @see: https://developer.mozilla.org/en-US/docs/Project:MDN/About?redirectlocale=en-US&redirectslug=Project%3ACopyrights#Copyrights_and_licenses
    // @see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions$compare?to=331165&from=330547
    // Some modifications 
    // - remove |-character from escaped characters list, since in this application, |-character needs to remain unescaped
    // - formatting
    // - check, if the string is actually valid string, not e.g. undefined
    function escapeRegExp(string) {
        if(typeof string !== 'string') {
            return;   
        }
        
        return string.replace(/([.*+?^=!:${}()\[\]\/\\])/g, "\\$1");
    }    
    
    /**
     * A function that removes spaces from line-start and line-end
     * and collapses all whitespace sequences into a single whitespace
     * and converts colons with spaces to colon-space -format
     *
     * @param string data
     * @return string normalized
     */
    function normalizeSpace(data) {
        var normalized;
        
        if(typeof data !== 'string') {
            return;    
        }
        // Remove all whitespaces on line-start and line-end    
        // And then collapse all spaces into single one
        // Also, when pipe-character has space before, after or both sides, it removes them
        normalized = data.replace(/(^\s+)/, '')
                         .replace(/(\s+$)/, '')
                         .replace(/(\s{2,})/g, ' ')
                         .replace(/(\s\|\s)/g, '|')
                         .replace(/(\s*\:\s*)/g, ': ');
        return normalized;
    }
         

    function createForm() {
        var content               = document.getElementById('generator'),
            wrapper               = document.createElement('div'),
            form                  = document.createElement('form'),
            questionHeading       = document.createElement('h2'),
            questionHeadingText   = document.createTextNode('Kysymykset ja vastaukset'),
            
            questionText          = document.createElement('textarea'),
            generateButtonText    = document.createTextNode('Luo JSON'),
            generateButton        = document.createElement('button');

        content.appendChild(wrapper);        
        wrapper.setAttribute('id', 'questionWrapper');

        form.setAttribute('method', 'post');
        form.setAttribute('name', 'questionForm');

        questionHeading.appendChild(questionHeadingText);
        wrapper.appendChild(questionHeading);

        generateButton.appendChild(generateButtonText);
        questionText.setAttribute('id', 'questionText');
        
        // Append elements to form
        form.appendChild(questionText);
        form.appendChild(generateButton);
        
        wrapper.appendChild(form);
        
        /**
         * An event listener, which takes the form input and converts it into 
         * question-answer data (JSON + answer as regexp).
         */
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            
            var resultContainer = document.getElementById('result'),    // Wrapper for results
                pre             = document.createElement('pre'),        // Put JSON data inside pre-tag
                preText,                                                // The text to be put inside pre-tag
                regexp,                                                 // Validation regexp
                dataObject,                                             // Data object to be converted into JSON object
                jsonText,                                               // JSON string
                data            = questionText.value,                   // Data from textarea
                arr             = [],                                   // Array, which holds elemts from the string which was split
                qa              = [],                                   // Holds QA-pairs
                _json           = [];                                   // Holds JSON-strings in an array from which they're joined as strings
                    
            arr = data.split(/\n|\r|\r\n/);
            for(var i=0; i < arr.length; i++) {
                var obj = {};
                    
                if(normalizeSpace(arr[i]).length === 0) {
                    continue;    
                }
                    
                obj.q = normalizeSpace(arr[i]);
                obj.a = escapeRegExp(normalizeSpace(arr[++i]));
                qa.push(obj);
            }
        
            for(var j=0; j < qa.length; j++) {
                // Create a data object to, that is similar to the final JSON
                // I looked for how to convert object to JSON:
                // @see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
                // @see: https://developer.mozilla.org/en-US/docs/JSON
                regexp = '^(' + qa[j].a + ')$';
                dataObject = {
                    questionText: qa[j].q,
                    validationRegexp: regexp
                };
                
                _json.push(JSON.stringify(dataObject, null, '    '));
            }

            preText = document.createTextNode(_json.join(",\n"));

            // Clear the container and append new content
            resultContainer.innerHTML = '';
            pre.appendChild(preText);
            
            resultContainer.appendChild(pre);
        });
    }
    
    createForm();
}());
