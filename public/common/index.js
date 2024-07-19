$(document).ready(function(){
    $("#submit").click(function(){
        const op1 = $('#op1').val();
        const op2 = $('#op2').val();
        const nBits = $('#nBits').val();
        const round = $('#round').val();
        const exp1 = parseInt($('#exp1').val());
        const exp2 = parseInt($('#exp2').val());

        //clear inputs
        $(".align").empty();
        $(".round1").empty();
        $(".op-table").empty();

        //Check Inputs
        validateInput(op1, op2, nBits, round, exp1, exp2);

        //step1 normalize the inputs move all decimal
        step1(op1, op2, nBits, round, exp1, exp2);

        
    });


    function validateInput(op1, op2, nBits, round) {
        let message = "";
        let message2 = "";
        let nValid = true;
        let bValid = true;
        
        $(".error-container").empty();
        let op1Temp = op1.replace(".", "");
        let op2Temp = op2.replace(".", "");
        if(op1Temp.length != nBits || op2Temp.length != nBits){
            nValid = false;
        }

        var i;
        if(nValid){
            for(i = 0; i < nBits; i++){
                if(op1[i] != "0" && op1[i] != "1" && op1[i] != "."){
                    bValid = false;   
                }
    
                if(op2[i] != "0" && op2[i] != "1" && op2[i] != "."){
                    bValid = false;
                }
            }
    
        }

        if(op1.length == 0 || op2.length==0 || nBits.length == 0){
            $(".error-container").append("<p class=\"error\">Please Provide all inputs.</p>");
        }
        if(nBits <= 0){
            $(".error-container").append("<p class=\"error\">Number of Digits must be greater than 0</p>");
        }
        // if(!nValid){
        //     $(".error-container").append("<p class=\"error\">Length of Input is not equal to number of digits</p>");
        // }
        
        if(!bValid){
            $(".error-container").append("<p class=\"error\">Input is not in Binary.</p>");
        }
    }



    function GRS(op, nBits){

    }

    function addition(op1, op2, nBits){
        let carry = [];
        let result = [];


        for(let i = nBits; i >= 0 ; i--){
            let sumTemp = parseInt(op1[i]) + parseInt(op2[i]);
            let carryTemp = sumTemp / 2;
            sumTemp %= 2;

        }
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
            return op;
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

        //step 2 operation
        step2(op1, op2, nBits, round, exp1, exp2);
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

        alignDecimal(op1, op2, nBits, round, exp1, exp2);
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


    function step2(op1, op2, nBits){

        //for formating
        let aligned = alignFloatingPoints(op1, op2);
        op1 = aligned.alignedOp1;
        op2 = aligned.alignedOp2;

        console.log(op1);
        console.log(op2);

        let carry = "", tempCarry = 0;
        let result = "", tempRes;

        for(let i = op1.length-1; i >= 0; i--){
            if(op1[i] == "."){
                result+=".";
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
            carry +="0";
        }



        $(".op-table").append("<p class=\"results\"> &nbsp &nbsp &nbsp &nbsp"+ Array.from(carry).reverse().join("") +"</p>");
        $(".op-table").append("<p class=\"results\">  &nbsp &nbsp &nbsp &nbsp"+ op1 +"</p>");
        $(".op-table").append("<p class=\"results\"> &nbsp &nbsp &nbsp &nbsp"+ op2 +"</p>");
        $(".op-table").append("<p class=\"results\">&nbsp&nbsp + </p>");
        $(".opp-res").append("<p class=\"results\">  &nbsp &nbsp &nbsp &nbsp"+ Array.from(result).reverse().join("") +"</p>");
    }
});