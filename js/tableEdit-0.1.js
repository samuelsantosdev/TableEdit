/*
 * @Copyright (c) 2014 Samuel Santos (samukaelsantos@gmail.com)
 * @Page http://samucasantos.com.br/TableEdit
 
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

/*
 * @Version: 0.1
 * @Release: 2014-02-19
 */

$.fn.tableEdit = function(settings, callback) {
    /*
     * 
     * Settings default
     * 
     */
    
    var defaults = {
        classTd: "tdEdit", //class to cell editable
        columnsTr: null, //index td editable, if null all td editables Ex.: "1,2,3,4,5"
        classBtEdit: "btEdit", //class of button for click event

        textBtSave: "Save", //text button save
        textBtEdit: "Edit", //text button edit
        
        enableCallBack: true,
        callBackObject: null,
        callback: function(){}

    }; //cells editables

    //load settings
    settings = $.extend(defaults, settings);

    return this.each(function() {


        var tdsIndex = (settings.columnsTr != null) ? settings.columnsTr.split(",") : null;
        var trsTable = $(this).find("tbody tr");

        function inArray(needle, haystack) {
            var length = haystack.length;
            for (var i = 0; i < length; i++) {
                if (haystack[i] == needle)
                    return true;
            }
            return false;
        }

        for (k = 0; k < trsTable.length; k++) {
            element = $(trsTable)[k];
            tdsLine = $(element).find("td");

            $.each(tdsLine, function(index, td) {
                if ($(td).find("." + settings.classBtEdit).length == 0) {
                    if (tdsIndex == null) {
                        $(td).addClass(settings.classTd);
                    } else {
                        if (inArray(index, tdsIndex)) {
                            $(td).addClass(settings.classTd);
                        }
                    }
                }
            });
        }
        ;

        function mountNewInput(cell) {
            var arrayAttr = $(cell).attr("class").split(" ");
            var attrs = new Array({name: "edit"});

            element = document.createElement("input");
            element.setAttribute("type", "text");
            element.setAttribute("value", $(cell).text());
            element.setAttribute("name", $(cell).attr("ref"));
            element.setAttribute("style", "width:" + $(cell).width() + "px");

            return element;
        }

        function editTr(tr) {
            var cells = $(tr).find("." + settings.classTd);

            $.each($(cells), function(index, cell) {
                text = $.trim($(cell).text());
                newInput = mountNewInput($(cell));
                $(cell).html("");
                $(cell).append(newInput);
            });
        }

        function saveTr(tr) {
            var cells = $(tr).find("." + settings.classTd);
            var callBackObject = new Array();
                    $.each($(cells), function(index, cell) {
                        input = $(cell).find('input[type=text]');
                        newValue = $.trim($(input).val());
                        callBackObject.push($(input).attr("name"), newValue);
                        $(cell).html("");
                        $(cell).append(newValue);
                    });
            settings.callBackObject = callBackObject;
        }
        
        function getCallback(){
            settings.callback(settings.callBackObject);//how can I send var a,b here
        }
        
        function changeBt(bt)
        {
            var hasClass = $(bt).hasClass(settings.classBtEdit);
            $(bt).attr("class", "").addClass(((hasClass) ? "btSave" : settings.classBtEdit));

            $(bt).text(((hasClass) ? settings.textBtSave : settings.textBtEdit));
            $(bt).val(((hasClass) ? settings.textBtSave : settings.textBtEdit));
        }

        function clickEvent() {

            var element_clicked = $(this);
            element_verify = element_clicked;
            while ($(element_verify).is("tr") == false) {
                element_verify = $(element_verify).parent();
            }

            if ($(this).hasClass("btSave")) {
                saveTr(element_verify);
                if(settings.enableCallBack){
                    getCallback();
                }
            } else {
                editTr(element_verify);
            }
            changeBt(element_clicked);
        }

        $("." + settings.classBtEdit).bind("click", clickEvent);

    });
}

