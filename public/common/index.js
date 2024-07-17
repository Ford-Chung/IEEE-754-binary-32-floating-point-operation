$(document).ready(function(){
    $("#submit").click(function(){
        const op1 = $('#op1').val();
        const op2 = $('#op2').val();
        const nBits = $('#nBits').val();
        const round = $('#round').val();
        //Check Inputs
        validateInput(op1, op2, nBits, round);

        //step1
        normalize(op1, op2, nBits, round);
    });


    function validateInput(op1, op2, nBits, round) {
        var message = "";
        var message2 = "";
        var nValid = true;
        var bValid = true;
        
        $(".error-container").empty();

        if(op1.length != nBits || op2.length != nBits){
            
            nValid = false;
        }

        var i;
        for(i = 0; i < nBits; i++){
            if(op1[i] != "0" && op1[i] != "1" && op1[i] != "." ){
                bValid = false;   
            }

            if(op2[i] != "0" && op2[i] != "1" && op2[i] != "."){
                bValid = false;
                
            }
        }

        if(op1.length == 0 || op2.length==0 || nBits.length == 0){
            $(".error-container").append("<p class=\"error\">Please Provide all inputs.</p>");
        }
        if(nBits <= 0){
            $(".error-container").append("<p class=\"error\">Number of Digits must be greater than 0</p>");
        }
        if(!nValid){
            $(".error-container").append("<p class=\"error\">Length of Input is not equal to number of digits</p>");
        }
        
        if(!bValid){
            $(".error-container").append("<p class=\"error\">Input is not in Binary.</p>");
        }
    }

    function normalize(op1, op2, nBits, round){
        
    }
});