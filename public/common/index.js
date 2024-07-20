$(document).ready(function(){
    $("#submit").click(function(){
        let op1 = $('#op1').val();
        let op2 = $('#op2').val();
        let nBits = $('#nBits').val();
        let round = $('#round').val();
        let exp1 = parseInt($('#exp1').val());
        let exp2 = parseInt($('#exp2').val());

        let sign1 = "";
        let sign2 = "";

        if(op1[0] == "-"){
            sign1 = "-";
            op1 = op1.substring(1);
        }
        if(op2[0] == "-"){
            sign2 = "-";
            op2 = op2.substring(1);
        }
        
        //clear inputs
        $(".align").empty();
        $(".round1").empty();
        $(".op-table").empty();
        $(".op-res").empty();
        $(".overflow").empty();
        $(".post-rounding").empty();

        //Check Inputs
        if(!validateInput(op1, op2, nBits, round, exp1, exp2)){
            //step1 normalize the inputs move all decimal
            let result = step1(op1, op2, nBits, round, exp1, exp2);


            //update the value based on the preprocessing steps
            op1 = result[0];
            op2 = result[1];
            exp1 = result[2];
            exp2 = result[3];

            //step 2 operation: addition operation
            let added = step2(op1, op2, sign1, sign2);

            //step 3 operation: Post operation normalization
            step3(added, nBits, exp1, round);
        }


    });

    function compareBinary(bin1, bin2) {
        // Helper function to convert binary string with radix point to decimal number
        function binaryToDecimal(bin) {
            let [intPart, fracPart] = bin.split('.');
    
            // Convert integer part
            let intDecimal = parseInt(intPart, 2);
    
            // Convert fractional part
            let fracDecimal = 0;
            if (fracPart) {
                for (let i = 0; i < fracPart.length; i++) {
                    if (fracPart[i] === '1') {
                        fracDecimal += Math.pow(2, -(i + 1));
                    }
                }
            }
    
            return intDecimal + fracDecimal;
        }
    
        // Convert both binary strings to decimal numbers
        const dec1 = binaryToDecimal(bin1);
        const dec2 = binaryToDecimal(bin2);
    
        // Compare the decimal numbers
        if (dec1 > dec2) {
            return 1;
        } else if (dec1 < dec2) {
            return 3;
        } else {
            return 3;
        }
    }


    function step3(added, nBits, exp1, round){
        //normalize check for overflow or just adjust the decimal point
        let placeholder;
        let exp = exp1;
        let result;
        //grs == 1, else rounding
        placeholder = normalize(added, nBits);
        exp += parseInt(placeholder[0]);
        result = placeholder[1];

        $(".overflow").append("<p class=\"results\"> Normalized: "+ result +" x2 ^ "+ exp +"</p>");

        if(round == "1"){

        }else{ 
            result = rounding(result, nBits);
        }

        placeholder = normalize(result, nBits);
        exp += parseInt(placeholder[0]);
        result = placeholder[1];

        $(".post-rounding").append("<p class=\"results\"> Rounding(TTE): "+ result +" x2 ^ "+ exp +"</p>");
    }


    function validateInput(op1, op2, nBits, round) {
        let message = "";
        let message2 = "";
        let bValid = true;
        let error = false;
        
        $(".error-container").empty();
        let op1Temp = op1.replace(".", "");
        let op2Temp = op2.replace(".", "");

        if(op1Temp[0] == "-"){
            op1Temp = op1Temp.substring(1);
        }
        
        if(op2Temp[0] == "-"){
            op2Temp = op1Temp.substring(1);
        }

        var i;
   
        
        for(i = 0; i < op1Temp.length; i++){
            if(op1Temp[i] != "0" && op1Temp[i] != "1"){
                bValid = false;   
            }
        }
        for(i = 0; i < op2Temp.length; i++){
            if(op2Temp[i] != "0" && op2Temp[i] != "1"){
                bValid = false;
            }
        }
        
    
        if(op1.length == 0 || op2.length==0 || nBits.length == 0){
            $(".error-container").append("<p class=\"error\">Please Provide all inputs.</p>");
            error = true;
        }
        if(nBits <= 0){
            $(".error-container").append("<p class=\"error\">Number of Digits must be greater than 0</p>");
            error = true;
        }
        
        if(!bValid){
            $(".error-container").append("<p class=\"error\">Input is not in Binary.</p>");
            error = true;
        }

        return error;
    }



    function GRS(op, nBits){

    }

    function addition(op1, op2){
        let carry = "", tempCarry = 0;
        let result = "", tempRes;

        for(let i = op1.length-1; i >= 0; i--){
            if(op1[i] == "."){
                result+=".";
                carry+=" ";
                continue;
            }
            tempRes = parseInt(op1[i]) + parseInt(op2[i]) + parseInt(tempCarry);
            tempCarry = Math.floor(tempRes / 2);
            tempRes = tempRes % 2;

            carry += tempCarry;
            result += tempRes;

        }

        if(tempCarry == 1){
            result +="1";
        }

        return [ Array.from(result).reverse().join(""),  Array.from(carry).reverse().join("")];
    }
    
    function rounding(op, nBits){
        let carry = "";
        let result = "";
        //nearest even
        if(op.length - 1 != nBits){
            nDigits = op.substring(0, parseInt(nBits)+1);
            excess = op.substring(parseInt(nBits)+1)

            if(excess[0] == "1"){
                tempRes = parseInt(op[nBits]) + 1;
                tempCarry = Math.floor(tempRes / 2);
                tempRes = tempRes % 2;
                result += "" + tempRes;
                carry += "" + tempCarry;

                for(let i = nBits-1; i >= 0; i--){
                    if(op[i] == "."){
                        result += ".";
                        continue;
                    }

                    tempRes = parseInt(op[i]) + parseInt(carry[carry.length-1]);
                    tempCarry =  Math.floor(tempRes / 2);
                    tempRes = tempRes % 2;

                    result += "" + tempRes;
                    carry += "" + tempCarry;
                }

                if(tempCarry == 1){
                    result +="1";
                    carry +="0";
                }
    
                result = Array.from(result).reverse().join("");

                return result; 
            }
            return op.substring(0, parseInt(nBits)+1);
        }else{
            return op;
        }

        
    }

    function alignDecimal(op1, op2, nBits, round, exp1, exp2){
        if(exp1 > exp2){
            let n = exp1 - exp2;
            op2 = shiftRight(nBits, op2, n);
            exp2 += n;
        }
        
        if(op1 < op2){
            let n = exp2 - exp1;
            op1 = shiftRight(nBits, op1, n);
            exp1 += n;
        }

        //insert Result 
        $(".align").append("<p class=\"results\"> Operator1: "+ op1 +"</p>");
        $(".align").append("<p class=\"results\"> Exponent1: "+ exp1 +"</p>");
        $(".align").append("<p class=\"results\"> Operator2: "+ op2 +"</p>");
        $(".align").append("<p class=\"results\"> Exponent2: "+ exp2 +"</p>");        

        //Make into appropriate length
        if(round == "1"){
            GRS(op1, nBits);
            GRS(op2, nBits);
        }else{
            op1 = rounding(op1, nBits);
            op2 = rounding(op2, nBits);
            $(".round1").append("<p class=\"results\"> Operator1: "+ op1 +"</p>");
            $(".round1").append("<p class=\"results\"> Operator2: "+ op2 +"</p>");
        }

        return [op1, op2, exp1, exp2];
        
    }




    function step1(op1, op2, nBits, round, exp1, exp2){
        let op1Dec = op1.indexOf(".");
        let op2Dec = op2.indexOf(".");
        let res1 = normalize(op1, nBits);
        let res2 = normalize(op2, nBits);

        //index 0 contains exp while index 1 contains the number itself
        //calculate new exponent
        exp1 += parseInt(res1[0]);
        exp2 += parseInt(res2[0]);
        op1 = res1[1];
        op2 = res2[1];

        return alignDecimal(op1, op2, nBits, round, exp1, exp2);
    }

    function normalize(op, nBits){
        let one = op.indexOf("1");
        let n, result;
        if(op.indexOf(".") == 1 && op.indexOf("1") == 0){
            n = 0;
            result = op;
        }else if(op.indexOf(".") == -1){
            result = op.substring(0, one) + "." + op.substring(one+1);
            n = nBits - 1 - one;
        }else{
            if(op.indexOf(".") < one){
                n = op.indexOf(".") - one;
            } else{
                n = op.indexOf(".") - one - 1;
            }
            
            op = op.replace(".", "");
            result = op.substring(0, one+1) + "." + op.substring(one+1);
        }

        result = result.substring(op.indexOf("1"));
        
        //extend to required digits
        if(result.length-1 < nBits){
            let tempLen = result.length-1;
            for(let i = 0; i < nBits - tempLen; i++){
                result += "0"; 
            }
        }

        return [n, result];
    }

    function shiftRight(nBits, op, n){
        for(let i = 0; i < n; i++){
            op = "0" + op;
        }
        let result = op.replace(".", "");
        result = result.substring(0, 1) + "." + result.substring(1);
        return result;
    }

    function alignFloatingPoints(op1, op2) {
        let [intPart1, decPart1] = op1.split('.');
        let [intPart2, decPart2] = op2.split('.');
    
        if (!decPart1) decPart1 = '';
        if (!decPart2) decPart2 = '';
    
        // Align integer parts by padding zeros
        if (intPart1.length > intPart2.length) {
            let n = intPart1.length - intPart2.length;
            for (let i = 0; i < n; i++) {
                intPart2 = '0' + intPart2;
            }
        } else {
            let n = intPart2.length - intPart1.length;
            for (let i = 0; i < n; i++) {
                intPart1 = '0' + intPart1;
            }
        }
    
        // Align decimal parts by padding zeros
        if (decPart1.length > decPart2.length) {
            let n = decPart1.length - decPart2.length;
            for (let i = 0; i < n; i++) {
                decPart2 += '0';
            }
        } else {
            let n = decPart2.length - decPart1.length;
            for (let i = 0; i < n; i++) {
                decPart1 += '0';
            }
        }
    
        // Combine the integer and decimal parts
        let alignedOp1 = intPart1 + '.' + decPart1;
        let alignedOp2 = intPart2 + '.' + decPart2;
    
        return { alignedOp1, alignedOp2 };
    }

    function subtraction(op1, op2){
        let carry = "", tempCarry = 0;
        let result = "", tempRes;

        for(let i = op1.length-1; i >= 0; i--){
            if(op1[i] == "."){
                result+=".";
                carry+=" ";
                continue;
            }
            tempRes = parseInt(op1[i]) - parseInt(op2[i]) - tempCarry;
            if(tempRes < 0){
                tempCarry = 1;
                tempRes += 2;
            }else{
                tempCarry = 0;
            }

            carry += tempCarry;
            result += tempRes;

        }


        return [ Array.from(result).reverse().join(""),  Array.from(carry).reverse().join("")];
    }

    function step2(op1, op2, sign1, sign2){

        //for formating
        let aligned = alignFloatingPoints(op1, op2);
        op1 = aligned.alignedOp1;
        op2 = aligned.alignedOp2;
        let placeholder;


        if((sign1 == "-" || sign2 == "-") && !(sign1 == "-" && sign2 == "-")){
            let greater = compareBinary(op1, op2) == 1
            if(greater == 1 || greater == 3){
                placeholder = subtraction(op1, op2);
            }else if(greater == 2){

            }
        }else{
            placeholder = addition(op1, op2);
        }

        
        let result = placeholder[0];
        let carry = placeholder[1];
        $(".op-table").append("<p class=\"results\"> &nbsp &nbsp &nbsp &nbsp"+ carry +"</p>");
        $(".op-table").append("<p class=\"results\">  &nbsp &nbsp &nbsp &nbsp"+ op1 +"</p>");
        $(".op-table").append("<p class=\"results\"> &nbsp &nbsp &nbsp &nbsp"+ op2 +"</p>");
        $(".op-table").append("<p class=\"results\">&nbsp&nbsp + </p>");
        $(".opp-res").append("<p class=\"results\">  &nbsp &nbsp &nbsp &nbsp"+ result +"</p>");
        return result;
    }
});