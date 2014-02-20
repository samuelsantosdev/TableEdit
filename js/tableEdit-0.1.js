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

$.fn.tableEdit = function(settings, callback, activeMasks) {
    /*
     * 
     * Settings default
     * 
     */
    
    var defaults = {
        classTd: "tdEdit", //class to cell editable
        columnsTr: null, //index td editable, if null all td editables Ex.: "1,2,3,4,5"
        classBtEdit: "btEdit", //class of button for click event
        
        enableDblClick: true,

        textBtSave: "Save", //text button save
        textBtEdit: "Edit", //text button edit
        
        callBackObject: null, //receive object
        callback: function(){}, //return object with of values change
        activeMasks: function(){} //use to call function enable masks

    }; //cells editables

    //load settings
    settings = $.extend(defaults, settings);
    
    return this.each(function() {
        
        //if columnsTr is not null, split to array. 
        var tdsIndex = (settings.columnsTr != null) ? settings.columnsTr.split(",") : null;
        //get all rows
        var trsTable = $(this).find("tbody tr");
        
        //funtion verify exists index
        function inArray(needle, haystack) {
            var length = haystack.length;
            for (var i = 0; i < length; i++) {
                if (haystack[i] == needle)
                    return true;
            }
            return false;
        }
        
        //loop in all rows
        for (k = 0; k < trsTable.length; k++) {
            element = $(trsTable)[k];
            tdsLine = $(element).find("td");
            
            $.each(tdsLine, function(index, td) {
                //if cell not have button edit
                if ($(td).find("." + settings.classBtEdit).length == 0) {
                    /*
                     * insert class edition
                     * for all columns or columns in tdsIndex
                     */
                    if (tdsIndex == null) {
                        $(td).addClass(settings.classTd);
                    } else {
                        if (inArray(index, tdsIndex)) {
                            $(td).addClass(settings.classTd);
                        }
                    }
                }
            });
        };
        
        //return create new input text
        function mountNewInput(cell) {
            
            var element = document.createElement("input");
            //get string in attribute ref
            var attrsString = $(cell).attr("ref");
            if(attrsString != null){
                //split attributes
                var attrsArray = attrsString.split(",");

                var currentObj;
                for(n=0; n < attrsArray.length; n++){
                    //separate name of attribute and value attribute
                    currentObj = attrsArray[n].split(":");
                    $(element).attr($.trim(currentObj[0]), $.trim(currentObj[1]));
                }
            }else{
                indexCell = $(cell).parent().children().index($(cell));
                element.setAttribute("name", "column_"+indexCell);
                element.setAttribute("type", "text");
            }
            
            element.setAttribute("value", $(cell).text());
            element.setAttribute("style", "width:" + $(cell).width() + "px");
            $(element).addClass("edit_from_te");
            return element;
        }
        
        //insert input in cell
        function editTr(tr) {
            var cells = $(tr).find("." + settings.classTd);

            $.each($(cells), function(index, cell) {
                newInput = mountNewInput($(cell));
                $(cell).html("");
                $(cell).append(newInput);
            });
            settings.activeMasks.call(this);
        }
        
        //insert input in cell
        function editTd(cell) {
            newInput = mountNewInput($(cell));
            $(cell).html("");
            $(cell).append(newInput).find("input").focus();
            settings.activeMasks.call(this);
        }
        
        //save values of inputs and create a object with values
        function saveTr(tr) {
            var cells = $(tr).find("." + settings.classTd);
            var callBackObject = {};
                    $.each($(cells), function(index, cell) {
                        input = $(cell).find('input');
                        if(typeof($(input).attr("name")) != "undefined"){
                            newValue = $.trim($(input).val());
                            callBackObject[$(input).attr("name")] = newValue;
                            $(cell).html("");
                            $(cell).append(newValue);
                        }
                    });
            settings.callBackObject = callBackObject;
        }
        
        //return object created in saveTr()
        function getCallback(){
            settings.callback(settings.callBackObject);//how can I send var a,b here
        }
        
        //change buttons, save to edit and edit to save
        function changeBt(bt)
        {
            var hasClass = $(bt).hasClass(settings.classBtEdit);
            $(bt).attr("class", "").addClass( ((hasClass) ? "btSave" : settings.classBtEdit) );

            $(bt).text(((hasClass) ? settings.textBtSave : settings.textBtEdit));
            $(bt).val(((hasClass) ? settings.textBtSave : settings.textBtEdit));
        }
        
        //event click in button
        function clickEvent() {

            var element_clicked = $(this);
            element_verify = element_clicked;
            
            //search tr, element by element 
            while ($(element_verify).is("tr") == false) {
                element_verify = $(element_verify).parent();
            }
            
            //if save button, call function save
            if ($(this).hasClass("btSave")) {
                saveTr(element_verify);
                getCallback();
            } else {
                //if edit button, call function save
                editTr(element_verify);
            }
            //call change button after click
            changeBt(element_clicked);
        }
        
        //edit cell with double click
        function dblClickEvent(){
            //if enableDblClick is true
            if(settings.enableDblClick){
                elementBt = $(this).parent().find("."+settings.classBtEdit);
                changeBt(elementBt);
                editTd($(this));
            }
        }
        
        //bind to click's
        $("." + settings.classBtEdit).bind("click", clickEvent);
        $("." + settings.classTd).bind("dblclick", dblClickEvent);
        
    });
}

