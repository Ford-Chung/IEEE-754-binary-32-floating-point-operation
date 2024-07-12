$(document).ready(function(){
    $("#submit").click(function(){
        const op1 = $('#op1').val();
        const op2 = $('#op2').val();
        const nBits = $('#nBits').val();
        const round = $('#round').val();

        console.log(op1);
        console.log(op2);
        console.log(nBits);
        console.log(round);
    });
});