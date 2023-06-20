
const BS_MONTHS = {
    // Nepali months doesn't have specific pattern in the number of days
    // Contains number of days in each months of year 2075 to 2090 BS
    2075: [ 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2076: [ 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
    2077: [ 31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
    2078: [ 31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
    2079: [ 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2080: [ 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
    2081: [ 31, 31, 32, 32, 31, 30, 30, 30, 29, 30, 30, 30],
    2082: [ 30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
    2083: [ 31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30, 30],
    2084: [ 31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30, 30],
    2085: [ 31, 32, 31, 32, 30, 31, 30, 30, 29, 30, 30, 30],
    2086: [ 30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
    2087: [ 31, 31, 32, 31, 31, 31, 30, 30, 29, 30, 30, 30],
    2088: [ 30, 31, 32, 32, 30, 31, 30, 30, 29, 30, 30, 30],
    2089: [ 30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
    2090: [ 30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30]
}

// Starting date in both AD and BS used to start counting
// Date before the following cannot be converted, need more months data
const STARTING_DATE = {
    AD: {
        year: 2018,
        month: 4,
        day: 14
    },
    BS: {
        year: 2075,
        month: 1,
        day: 1
    }
}

function getMonthDays_BS(year,month){
    // returning the corresponding days of corresponding month
    return BS_MONTHS[year][month-1];
}

const isADLeapYear = year=>year%4==0;

function getMonthDays_AD(year,month){
    if (month==1) return 31;
    if (month==2) return isADLeapYear(year)?29:28;
    if (month==3) return 31;
    if (month==4) return 30;
    if (month==5) return 31;
    if (month==6) return 30;
    if (month==7) return 31;
    if (month==8) return 31;
    if (month==9) return 30;
    if (month==10) return 31;
    if (month==11) return 30;
    if (month==12) return 31;
    return -1;
}

// Counts each day from the starting date to the provided date
function daysBetween(start_date,end_date,AD=true){
    let days_count = 0;
    while(true){
        let total_days_of_month = AD?getMonthDays_AD(start_date.year,start_date.month)
                                    :getMonthDays_BS(start_date.year,start_date.month);
        start_date.day++;
        if (start_date.day>total_days_of_month){
            start_date.month++;
            start_date.day = 1;
        }
        if (start_date.month>12){
            start_date.year++;
            start_date.month = 1;
            start_date.day = 1;
        }
        days_count++;
        if (start_date.day>=end_date.day && 
            start_date.month>=end_date.month && 
            start_date.year>=end_date.year){
                break;
        }
    }
    return days_count;
}


function convertToAD(BS_to_convert){
    let days_to_count = daysBetween({...STARTING_DATE.BS},BS_to_convert,false);
    let AD = {...STARTING_DATE.AD};
    while (days_to_count > 0) {
        let days_in_current_english_month = getMonthDays_AD(AD.year,AD.month);
        if (AD.day > days_in_current_english_month) {
            AD.month++;
            AD.day = 1;
        }
        if (AD.month > 12) {
            AD.year++;
            AD.month = 1; 
        }
        AD.day++;
        days_to_count--;
    }
    return AD;
}

function convertToBS(AD_to_convert){
    let days_to_count = daysBetween({...STARTING_DATE.AD},AD_to_convert);
    let BS = {...STARTING_DATE.BS};
    while (days_to_count > 0) {
        let days_in_current_nepali_month = getMonthDays_BS(BS.year,BS.month)
        if (BS.day > days_in_current_nepali_month) {
            BS.month++;
            BS.day = 1;
        }
        if (BS.month > 12) {
            BS.year++;
            BS.month = 1; 
        }
        BS.day++;
        days_to_count--;
    }
    return BS;
}

console.log(convertToBS({year:2023,month:6,day:20})); // { year: 2080, month: 3, day: 5 }
console.log(convertToAD({year:2080,month:1,day:5 })); // { year: 2023, month: 4, day: 18 }
