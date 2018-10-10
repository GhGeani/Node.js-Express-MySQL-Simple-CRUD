$(document).ready(function(){
    $('.edit-form').submit(function(evt){
        //evt.preventDefault();
        if(confirm('This profile will be edited...')){
            //$(".edit-form").unbind('submit');
        }else{
            return false;
        }
    });

    $('.delBtn').on('click', function(evt){
        //evt.preventDefault();
        if(confirm('This profile will be deleted...')){
            //$(this).unbind('click');
        }else{
            return false;
        }
    });
});