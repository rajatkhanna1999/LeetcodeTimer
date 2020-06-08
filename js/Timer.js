'use strict';

const objectId = 'navbar-right-container';
const problemName = location.href.split('/')[4];
const storageKey = problemName + '-Time';
const storageKey1 = problemName + '-TimeLimit';
const wrapper = {};
let TimeLimit;
let TimerHandler;

const Timeout = (objectId, wrapper) => {
    const objectToBeGet = document.getElementById(objectId);
    if (objectToBeGet !== null) {
        wrapper['key'] = objectToBeGet;
        return;
    }
    window.setTimeout(Timeout, 1000, objectId, wrapper);
};

const InsertClock = (wrapper) => {
    if (!wrapper.key) {
        window.setTimeout(InsertClock, 1100, wrapper);
        return;
    }

    const rightBarContainer = wrapper.key;
    const clock = generateClock();
    TimerHandler = createClockHandler(clock);

    const startTimer = document.createElement('button');
    startTimer.innerHTML = 'Start Timer';
    startTimer.id = "start-timer";
    startTimer.style.color = '#FFA500';
    startTimer.style.marginLeft = '5px';
    startTimer.style.marginRight = '5px';
    startTimer.style.border = "1px solid #FFA500";
    startTimer.style.backgroundColor = "rgba(0,0,0,0)";

    var minutes = document.createElement("input");
    minutes.type = "number";
    minutes.className = "custom-input";
    minutes.id = "hrs";
    minutes.placeholder = "Enter Time In Minutes"
    minutes.style.marginLeft = '5px';
    minutes.style.height = '23px';
    minutes.style.width = '150px';
    minutes.style.border = "1px solid #FFA500";

    TimeLimit = 0;

    rightBarContainer.insertBefore(startTimer, rightBarContainer.firstChild);
    rightBarContainer.insertBefore(minutes, startTimer);
    rightBarContainer.insertBefore(clock, minutes);

    startTimer.onclick = () => {
        if (TimerHandler) {
            TimeLimit = minutes.value*60*1000;
            window.clearInterval(TimerHandler);
        }
        TimeLimit = minutes.value*60*1000;
        TimerHandler = createClockHandler(clock, true);
    };    

    startTimer.onmouseover = () => {
        startTimer.style.color = "#FFFFFF";
        startTimer.style.backgroundColor = '#FFA500';
    };

    startTimer.onmouseout = () => {
        startTimer.style.color = '#FFA500';
        startTimer.style.backgroundColor = "rgba(0,0,0,0)";
    };
};

const generateClock = () => {
    const clock = document.createElement('div');
    clock.setAttribute("id", "Div1");
    return clock;
};

const createClockHandler = (clock, refresh) => {
    clock.innerHTML = ' time used';
    let time;
    if (refresh) {
        time = 1;
    } else {
        chrome.storage.local.get([storageKey], (key) => {
            console.log('[leetcode keeper] ' + storageKey + ':' + key[storageKey]);
            if (key[storageKey]) {
                time = key[storageKey];
            } else {
                time = 1;
            }
        });
        chrome.storage.local.get([storageKey1], (key) => {
            console.log('[leetcode keeper] ' + storageKey1 + ':' + key[storageKey1]);
            if (key[storageKey1]) {
                TimeLimit = key[storageKey1];
            } else {
                TimeLimit = -100*1000;
            }
        });
    }
    const intervalTime = 1000;
    return window.setInterval(() => {
        if (time) {
            time += intervalTime;
            if(TimeLimit == -100*1000){
                clock.innerHTML = "Select time in minutes and click on Start Timer to begin your timer. Wishing u a good luck!!";
                clock.style.font = "italic bold 13px arial,serif";
                document.getElementById("Div1").style.color = "#546e7a";
            }else{
                if(TimeLimit - time + 1 > 0){
                    clock.innerHTML = String(Math.floor((TimeLimit - time + 1)/(1000 * 60))) + ' minutes : ';
                    clock.innerHTML += String(Math.floor(((TimeLimit - time + 1) % (1000 * 60)) / 1000)) + ' seconds left';
                    document.getElementById("Div1").style.color = "#546e7a";
                    if(TimeLimit - time + 1 <= 60000){
                        clock.innerHTML = String(Math.floor(((TimeLimit - time + 1) % (1000 * 60)) / 1000)) + ' seconds left';
                        document.getElementById("Div1").style.color = "red";
                    }
                }else{
                    clock.innerHTML = "Time Finished!";
                }
            }
            const setObject = {};
            console.log(TimeLimit);
            setObject[storageKey] = time;
            setObject[storageKey1] = TimeLimit;
            if ((time - 1) % 1000 === 0) {
                chrome.storage.local.set(setObject);
            }
        }
    }, intervalTime);
};

Timeout(objectId, wrapper);
InsertClock(wrapper);