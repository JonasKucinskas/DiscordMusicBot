function addTime(num1, num2){//does'nt account for hours, cuz rare case.
    let seconds1 = num1 - Math.floor(num1);
    let seconds2 = num2 - Math.floor(num2);

    let minutes1 = Math.floor(num1);
    let minutes2 = Math.floor(num2);

    let minutes = minutes1 + minutes2;
    let seconds = seconds1 + seconds2;


    if (seconds1 + seconds2 > 0.6){
        seconds = seconds1 + seconds2 - 0.6;
        minutes += 1;
    }

    let time = minutes + seconds;

    return Math.round(time * 100) / 100;
}

module.exports = { addTime }