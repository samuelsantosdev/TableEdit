[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.png?v=103)](https://opensource.org/licenses/mit-license.php)

# TableEdit

```html
<script src="js/tableEdit-0.1.js"></script>

<!-- load plugin for element -->
<script>
$(function(){
        $("#tableEdit").tableEdit({
                    columnsTr: "2,3", //null = all columns editable
                    enableDblClick: true, //enable edit td with dblclick
                    callback: function(e){
                        console.log(e.city);
                        console.log(e.age);
                        /*
                         * code for ajax
                         */
                    }, 
                    activeMasks: function(){
                       console.log("function enable masks");
                       /*
                        * function for active masks
                        */
                    }
                });
})
</script>
```
