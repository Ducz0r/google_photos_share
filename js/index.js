(function() {
    'use strict';

    /******************************/
    /** Variables                 */
    /******************************/

    // Constants
    var CORS_PREFIX = 'https://cors-anywhere.herokuapp.com/';
    var NEWLINE_REGEX = /(\r\n|\n|\r)/gm;
    var IMAGE_REGEX = /\["(https:\/\/.{3}\.googleusercontent\.com\/.{139})",\d{1,8},\d{1,8},null,null,null,null,null,null,\[\d{1,16}\]\]/gm;

    // HTML Elements
    var inputForm = $('[data-role=submit-url]');
    var fieldSet = inputForm.find('fieldset');
    var inputField = inputForm.find('input');
    var submitBtn = inputForm.find('button');

    var errorAlert = $('[data-role=error-alert]');

    var outputContainer = $('[data-role=output-container]');
    var successAlert = $('[data-role=success-alert]');
    var outputBtn1 = $('[data-role=output-hyperlinks]');
    var outputBtn2 = $('[data-role=output-fs-hyperlinks]');
    var outputBtn3 = $('[data-role=output-wp-html]');
    var outputContents = $('[data-role=output-contents]');

    // Data container for the photos data
    var data = [];

    /******************************/
    /** Functions                 */
    /******************************/

    function initInputFieldChangeBehavior() {
        inputField.on('change paste keyup', function() {
            if ($(this).val().length > 0) {
                submitBtn.removeAttr('disabled');
            } else {
                submitBtn.attr('disabled', 'disabled');
            }
        });
    }

    function fetchData(successCallback, errorCallback, completeCallback) {
        data = [];

        fetch(CORS_PREFIX + inputField.val(), {
                method: 'GET',
                mode: 'cors',
                redirect: 'follow'
            })
            .then(function(data) { return data.text(); })
            .then(function(html) {
                var html2 = html.replace(NEWLINE_REGEX, "");
                var res = html2.match(IMAGE_REGEX);
                _.each(res, function(resItem) {
                    var el = JSON.parse(resItem);
                    data.push({ url: el[0], w: el[1], h: el[2] });
                });

                if (data.length && data.length > 0) {
                    successCallback();
                } else {
                    errorCallback();
                }
            })
            .catch(function(error) { errorCallback(); })
            .then(function() { completeCallback(); });
    }

    function initFormSubmission() {
        inputForm.on('submit', function(event) {
            event.preventDefault();

            fieldSet.attr('disabled', 'disabled');
            errorAlert.text('').hide();
            outputContainer.hide();
            successAlert.text('');
            outputContents.text('');

            var onSuccess = function() {
                successAlert.text(
                    'Photos extraction successful! ' +
                    data.length +
                    ' photos extracted.'
                );
                outputBtn1.click();
                outputContainer.show();
            };
            var onError = function() {
                errorAlert.text('Invalid URL, or no photos could be fetched.').show();
            };
            var onComplete = function() { fieldSet.removeAttr('disabled'); };

            fetchData(onSuccess, onError, onComplete);
        });
    }

    function initOutputFormattingOptions() {
        outputBtn1.on('click', function() {
            var output = '';
            _.each(data, function(el) {
                output = output + [
                    el.url,
                    '<br><br>'
                ].join('');
            });
            outputContents.html(output);
        });

        outputBtn2.on('click', function() {
            var output = '';
            _.each(data, function(el) {
                output = output + [
                    el.url,
                    '=w' + el.w,
                    '-h' + el.h,
                    '-no<br><br>'
                ].join('');
            });
            outputContents.html(output);
        });

        outputBtn3.on('click', function() {
            var output = '';
            _.each(data, function(el) {
                output = output + [
                    '&lt;a href="',
                    el.url,
                    '=w' + el.w,
                    '-h' + el.h,
                    '-no" data-size="' + el.w + 'x' + el.h,
                    '" class="fancyboxforwp" data-fancybox="gallery"&gt;',
                    '&lt;img src="' + el.url + '" alt="' + el.url + '" ',
                    'class="alignnone peg-photo"&gt;&lt;/a&gt;<br><br>'
                ].join('');
            });
            outputContents.html(output);
        });
    }

    /******************************/
    /** Initialization            */
    /******************************/

    initInputFieldChangeBehavior();
    initFormSubmission();
    initOutputFormattingOptions();
})();