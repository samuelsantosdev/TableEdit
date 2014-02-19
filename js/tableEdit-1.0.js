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

    $.fn.tableEdit = function(settings) {
        /*
         * 
         * Settings default
         * 
         */
        var defaults = {
            classTd: "tdEdit", //class to cell editable
            classBtEdit: "btEdit", //class of button for click event
            textBtSave: "Save", //text to change of button edit turn yourself save
            textBtEdit: "", //parameter for get the button text 
            cellsTr: null}; //cells editables
        
        //load settings
        settings = $.extend(defaults, settings);
        
        return this.each(function() {

            function mountNewInput(cell) {
                var arrayAttr = $(cell).attr("class").split(" ");
                var attrs = new Array({name: "edit"});
                
                element = document.createElement("input");
                element.setAttribute("value", $(cell).text());
                element.setAttribute("style", "width:"+$(cell).width()+"px");
                console.log($(element).html());
                return element;
            }

            function editTr(tr) {
                var cells = $(tr).find("."+defaults.classTd);
                console.log($(cells).html());
                $.each($(cells), function(index, cell) {
                    console.log($(cell).text()+"\n");
                    text = $.trim($(cell).text());
                    newInput = mountNewInput($(cell));
                    $(cell).html("");
                    $(cell).append(newInput);
                });
            }
            
            function changeBt(bt)
            {
               $(bt).addClass( (($(bt).hasClass("btEdit")) ? "btSave" : "btEdit") );
               $(bt).text( (($(bt).hasClass("btEdit")) ? defaults.textBtSave : defaults.textBtEdit) );
               $(bt).bind();
            }
            
            function clickEvent(){
                defaults.textBtEdit = $(this).text();
                var element_clicked = $(this);
                element_verify = element_clicked;
                while($(element_verify).is("tr") == false){
                    element_verify = $(element_verify).parent();
                }
                editTr(element_verify);
                changeBt(element_clicked);
            }
            
            $("."+defaults.classBtEdit).bind("click", clickEvent);
           
        });
    }

