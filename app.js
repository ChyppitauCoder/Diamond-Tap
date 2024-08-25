document.addEventListener('touchmove', function(event) {
    event.preventDefault();
}, { passive: false });

const scrollY = window.scrollY;
document.body.style.position = 'fixed';
document.body.style.top = `-${scrollY}px`;

document.body.style.position = '';
document.body.style.top = '';
window.scrollTo(0, scrollY);

document.addEventListener('touchstart', function(e) {
    e.preventDefault();
}, { passive: false });

document.addEventListener('touchmove', function(e) {
    e.preventDefault();
}, { passive: false });

let _score = $('#score-text');
let _diamond = $('#diamond-tap');
let _hamster_task = $('#hamster-task'); 
let coastes = [100, 1000, 5000, 10000, 15000, 50000, 100000, 500000, 1000000, 10000000, 100000000, 1000000000];
let current_league = '';
let local_clicked = 0;
let _ultra_tap = $('#upgrade-btn-ultra-tap');
let _tasks_text = $('#tasks-text');
let second_past_click = 0;
let leagues = ['Gold', 'Platinum', 'Legendary', 'Legend', 'Absolute Pro', 'Mythic', 'Lord', 'Shark', 'Universe Owner', 'Multi Universes Owner', 'Unbeatable', 'God'];
let _league = $('#league');
let _explore = $('#explore');
let _fallingDiamondsContainer = $('#falling-out-diamonds-container');
let score = 0;
let _profitPerSecondBtn = $('#upgrade-btn-profit-per-second');
let _profitPerSecondText = $('#profit-per-second');
let opened_is = false;
let second_past_click_count_interval = null;
let ultraTap = false;
let is_ultra_tap_allowed = true;
let used_ultra_tap_times = 0;
let usages_ultra_tap_left = 3;
let _ultra_tap_usages_text = $('ultra-tap-usages-allowed');

let per_tap = 0;

let profitPerSecond = 0;
let profitUpgradeCount = 0;
let lastVisitTime = Date.now();
let profitUpgradeCost = 100; 

setInterval(() => {
    updateLeagueAndPerTap();
}, 250);

setInterval(() => {
    _ultra_tap_usages_text.text(`Ultra Tap Usages Allowed: ${usages_ultra_tap_left}`);
}, 250);

setInterval(() => {
    _profitPerSecondBtn.text(`Upgrade! (-${profitUpgradeCost})`)
}, 250);

setInterval(() => {
    if (used_ultra_tap_times >= 3){
        is_ultra_tap_allowed = false;
    }
}, 5);

setInterval(() => {
    if (ultraTap){
        _diamond
    }
}, 250);

setInterval(() => {
    if (opened_is === true){
        _hamster_task.hide();
        _tasks_text.hide();
    }
}, 250);

function setDiamonds() {
    localStorage.setItem('score', score);
}

function setProfitPerSecond() {
    localStorage.setItem('profitPerSecond', profitPerSecond);
}

function setLastVisitTime() {
    localStorage.setItem('lastVisitTime', Date.now());
}

function setProfitUpgradeCount() {
    localStorage.setItem('profitUpgradeCount', profitUpgradeCount);
}

function setProfitUpgradeCost() {
    localStorage.setItem('profitUpgradeCost', profitUpgradeCost);
}

function setUsedUltraTapTimes() {
    localStorage.setItem('used_ultra_tap_times', used_ultra_tap_times);
}

function setProfitUpgradeCost() {
    localStorage.setItem('profitUpgradeCost', profitUpgradeCost);
}

function startOrResetTimer() {
    if (second_past_click_count_interval !== null) {
        clearInterval(second_past_click_count_interval);
    }

    second_past_click = 0;
    second_past_click_count_interval = setInterval(() => {
        second_past_click++;
        console.log(second_past_click)
    }, 1000);
}

function setIsOpened() {
    localStorage.setItem('opened_is', JSON.stringify(opened_is));
}

function setUsagesUltraTapLeft() {
    localStorage.setItem('usages_ultra_tap_left', JSON.stringify(usages_ultra_tap_left));
}

function updateDiamonds(increment) {
    if (!ultraTap) {
        score += increment || per_tap;
        local_clicked += 1;
    } else {
        score += (increment || per_tap) * 5; 
        local_clicked += 1;
    }
    _score.text(`${score}`);
    setDiamonds();
}

function getProfitPerSecond() {
    const savedProfitPerSecond = localStorage.getItem('profitPerSecond');
    if (savedProfitPerSecond !== null) {
        profitPerSecond = parseInt(savedProfitPerSecond, 10);
        _profitPerSecondText.text(`Profit per second: ${profitPerSecond}`);
    }
}

function getLastVisitTime() {
    const savedLastVisitTime = localStorage.getItem('lastVisitTime');
    if (savedLastVisitTime !== null) {
        lastVisitTime = parseInt(savedLastVisitTime, 10);
    }
}

function getUsagesUltraTapLeft() {
    const savedUsagesUltraTapLeft = localStorage.getItem('usages_ultra_tap_left');
    if (savedUsagesUltraTapLeft !== null) {
        usages_ultra_tap_left = parseInt(savedUsagesUltraTapLeft, 10);
    }
}

function getProfitUpgradeCount() {
    const savedProfitUpgradeCount = localStorage.getItem('profitUpgradeCount');
    if (savedProfitUpgradeCount !== null) {
        profitUpgradeCount = parseInt(savedProfitUpgradeCount, 10);
    }
}

function getProfitUpgradeCost() {
    const savedProfitUpgradeCost = localStorage.getItem('profitUpgradeCost');
    if (savedProfitUpgradeCost !== null) {
        profitUpgradeCost = parseInt(savedProfitUpgradeCost, 10);
    }
}

function getDiamonds() {
    const savedScore = localStorage.getItem('score');
    if (savedScore !== null) {
        score = parseInt(savedScore, 10);
        _score.text(`${score}`);
    }
}

function getUsedUltraTapTimes() {
    const savedUsedUltraTapTimes = localStorage.getItem('used_ultra_tap_times');
    if (savedUsedUltraTapTimes !== null) {
        used_ultra_tap_times = parseInt(savedUsedUltraTapTimes, 10);
        if (used_ultra_tap_times >= 3) {
            is_ultra_tap_allowed = false;
        }
    }
}

function getIsOpened() {
    const savedIsOpened = localStorage.getItem('opened_is');
    if (savedIsOpened !== null) {
        opened_is = JSON.parse(savedIsOpened);
    }
}

const maxAbsenceTime = 3 * 60 * 60;

function calculateOfflineEarnings() {
    const currentTime = Date.now();
    const timeElapsed = Math.floor((currentTime - lastVisitTime) / 20000);

    const limitedTimeElapsed = Math.min(timeElapsed, maxAbsenceTime);

    const offlineEarnings = limitedTimeElapsed * profitPerSecond;
    if (limitedTimeElapsed > 0) {
        alert(`You Earned ${offlineEarnings} by Your Profit Per 20 Second!`)
        updateDiamonds(offlineEarnings);
    }

    setLastVisitTime();
}

function resetUsedUltraTapTimesIfNewDay() {
    const lastResetTime = localStorage.getItem('lastResetTime');
    const currentTime = new Date().getTime();

    if (!lastResetTime || (currentTime - lastResetTime) > 24 * 60 * 60 * 1000) {
        used_ultra_tap_times = 0;
        setUsedUltraTapTimes();
        localStorage.setItem('lastResetTime', currentTime);
        is_ultra_tap_allowed = true;
    }
}

getDiamonds();
getIsOpened();
getUsagesUltraTapLeft();
getProfitPerSecond();
getProfitUpgradeCount();
getProfitUpgradeCost();
getLastVisitTime();
getIsOpened();
resetUsedUltraTapTimesIfNewDay();
getUsedUltraTapTimes();

calculateOfflineEarnings();

function updateLeagueAndPerTap() {
    if (score >= coastes[0] && score < coastes[1]){
        current_league = leagues[0];
    } else if(score >= 1000 && score < 5000){
        current_league = leagues[1];
    } else if(score >= 5000 && score < 10000){
        current_league = leagues[2];
    } else if(score >= 10000 && score < 15000){
        current_league = leagues[3];
    } else if(score >= 15000 && score < 50000){
        current_league = leagues[4];
    } else if(score >= 50000 && score < 100000){
        current_league = leagues[5];
    } else if(score >= 100000 && score < 500000){
        current_league = leagues[6];
    } else if(score >= 500000 && score < 1000000){
        current_league = leagues[7];
    } else if(score >= 1000000 && score < 10000000){
        current_league = leagues[8];
    } else if(score >= 10000000 && score < 100000000){
        current_league = leagues[9];
    } else if(score >= 100000000 && score < 1000000000){
        current_league = leagues[10];
    } else if(score >= 1000000000){
        current_league = leagues[11];
    }
    
    per_tap = leagues.indexOf(current_league) >= 1 ? leagues.indexOf(current_league) + (2 * leagues.indexOf(current_league)) : 1;
    _league.text(`League: ${current_league}`);
}

function exploreLeagues(){
    if (second_past_click >= 3 || second_past_click == 0 && local_clicked == 0){
        for (let i = 0; i < leagues.length; i++){
            alert(`League: ${leagues[i]}, cost: ${coastes[i]}`);
        }
    }
}

function ultra_Tap(){
    if (second_past_click >= 3){
        if (is_ultra_tap_allowed === true){
            used_ultra_tap_times += 1;
            usages_ultra_tap_left -= used_ultra_tap_times;
            setUsedUltraTapTimes();
            setUsagesUltraTapLeft();

            _diamond.attr('src', 'Brilliant-ultra-tap.png');
            ultraTap = true;

            setTimeout(() => {
                ultraTap = false;
                _diamond.attr('src', 'diamond-click.png');
            }, 15000);
            
        } else {
            alert('Ultra tap not allowed now. You used all allowed times (3).');
        }
    }
}

_explore.on('click', () => {
    exploreLeagues();
});

_ultra_tap.on('click', () => {
    ultra_Tap();
});

_ultra_tap.on('touchstart', () => {
    ultra_Tap();
});

_explore.on('touchstart', () => {
    exploreLeagues();
});

_diamond.on('dragstart', function(e) {
    e.preventDefault();
});

_diamond.on('touchmove', function(e) {
    e.preventDefault();
});

_diamond.on('mousedown touchstart', function(e) {
    e.preventDefault();
});

_diamond.on('click', function (e) {
    _diamond.addClass('shrink');
    setTimeout(() => {
        _diamond.removeClass('shrink');
    }, 100);

    // second_past_click = 0;
    // second_past_click_count_interval = setInterval(() => {
    //     second_past_click++;
    //     console.log(second_past_click);
    // }, 1000);

    startOrResetTimer();

    const x = e.pageX;
    const y = e.pageY;
    if (!ultraTap){
        const plusOne = $(`<div class="plus-one">+${per_tap}</div>`);
        plusOne.css({
            top: y + 'px',
            left: x + 'px'
        });
        $('body').append(plusOne);
        setTimeout(() => {
            plusOne.css({
                transform: 'translateY(-50px)',
                opacity: 0
            });
        }, 10);
        setTimeout(() => {
            plusOne.remove();
        }, 1000);
    } else {
        const plusOne = $(`<div class="plus-one">+${per_tap * 5}</div>`);
        plusOne.css({
            top: y + 'px',
            left: x + 'px'
        });
        $('body').append(plusOne);
        setTimeout(() => {
            plusOne.css({
                transform: 'translateY(-50px)',
                opacity: 0
            });
        }, 10);
        setTimeout(() => {
            plusOne.remove();
        }, 1000);
    }
    
    updateDiamonds();

    const fallingDiamond = $('<img src="imgs/diamonds-on-tap.png" class="falling-diamond">');
    fallingDiamond.css('width', '10%')
    _fallingDiamondsContainer.append(fallingDiamond);

    fallingDiamond.on('click', function () {
        const x_edited = e.clientX;
        const y_edited = e.clientY;
        const incrementValue = ultraTap ? per_tap * 10 * 5 : per_tap * 10;
        
        const plusOne = $(`<div class="plus-one">+${incrementValue}</div>`);
        plusOne.css({
            top: y_edited + 'px',
            left: x_edited + 'px'
        });
        $('body').append(plusOne);
        setTimeout(() => {
            plusOne.css({
                transform: 'translateY(-50px)',
                opacity: 0
            });
        }, 10);
        setTimeout(() => {
            plusOne.remove();
        }, 1000);
        
        updateDiamonds(incrementValue);
        fallingDiamond.remove();
    });
    

    setTimeout(() => {
        fallingDiamond.css('opacity', 0);
        setTimeout(() => {
            fallingDiamond.remove();
        }, 1000);
    }, 3000);
});

_diamond.on('touchstart', function (e) {
    _diamond.addClass('shrink');
    setTimeout(() => {
        _diamond.removeClass('shrink');
    }, 100);

    const touch = e.touches[0];

    // second_past_click = 0;
    // second_past_click_count_interval = setInterval(() => {
    //     second_past_click++;
    //     console.log(second_past_click);
    // }, 1000);

    startOrResetTimer();

    const x = touch.clientX;
    const y = touch.clientY;
    if (!ultraTap){
        const plusOne = $(`<div class="plus-one">+${per_tap}</div>`);
        plusOne.css({
            top: y + 'px',
            left: x + 'px'
        });
        $('body').append(plusOne);
        setTimeout(() => {
            plusOne.css({
                transform: 'translateY(-50px)',
                opacity: 0
            });
        }, 10);
        setTimeout(() => {
            plusOne.remove();
        }, 1000);
    } else {
        const plusOne = $(`<div class="plus-one">+${per_tap * 10}</div>`);
        plusOne.css({
            top: y + 'px',
            left: x + 'px'
        });
        $('body').append(plusOne);
        setTimeout(() => {
            plusOne.css({
                transform: 'translateY(-50px)',
                opacity: 0
            });
        }, 10);
        setTimeout(() => {
            plusOne.remove();
        }, 1000);
    }

    updateDiamonds();

    const fallingDiamond = $('<img src="imgs/diamonds-on-tap.png" class="falling-diamond">');
    _fallingDiamondsContainer.append(fallingDiamond);

    fallingDiamond.on('touchstart', function () {
        const x_edited = e.clientX;
        const y_edited = e.clientY;
        const incrementValue = ultraTap ? per_tap * 10 * 5 : per_tap * 10;
        
        const plusOne = $(`<div class="plus-one">+${incrementValue}</div>`);
        plusOne.css({
            top: y_edited + 'px',
            left: x_edited + 'px'
        });
        $('body').append(plusOne);
        setTimeout(() => {
            plusOne.css({
                transform: 'translateY(-50px)',
                opacity: 0
            });
        }, 10);
        setTimeout(() => {
            plusOne.remove();
        }, 1000);
        
        updateDiamonds(incrementValue);
        fallingDiamond.remove();
    });    

    setTimeout(() => {
        fallingDiamond.css('opacity', 0);
        setTimeout(() => {
            fallingDiamond.remove();
        }, 1000);
    }, 3000);
});

_hamster_task.on('click', () => {
    window.open('https://t.me/hamsTer_kombat_bot/start?startapp=kentId5609010123');
    updateDiamonds(increment = 1000 * per_tap);
    opened_is = true;
    setIsOpened();
});

_hamster_task.on('touchstart', () => {
    window.open('https://t.me/hamsTer_kombat_bot/start?startapp=kentId5609010123');
    updateDiamonds(increment = 1000 * per_tap);
    opened_is = true;
    setIsOpened();
});

_profitPerSecondBtn.on('click', function () {
    if (second_past_click >= 3 || second_past_click == 0 && local_clicked == 0){
        if (score >= profitUpgradeCost) {
            score -= profitUpgradeCost;
            profitPerSecond++;
            profitUpgradeCount++;
            profitUpgradeCost = profitUpgradeCost + 2 * profitUpgradeCount + profitPerSecond * 10;
            
            _score.text(`${score}`);
            _profitPerSecondText.text(`Profit per 20 second: ${profitPerSecond}`);
            
            setDiamonds();
            setProfitPerSecond();
            setProfitUpgradeCount();
            setProfitUpgradeCost();
        } else {
            alert("Not enough diamonds to upgrade profit per second!");
        }
    }
});

_profitPerSecondBtn.on('touchstart', function () {
    if (second_past_click >= 3 || second_past_click == 0 && local_clicked == 0){
        if (score >= profitUpgradeCost) {
            score -= profitUpgradeCost;
            profitPerSecond++;
            profitUpgradeCount++;
            profitUpgradeCost = profitUpgradeCost + 2 * profitUpgradeCount + profitPerSecond * 10;
            
            _score.text(`${score}`);
            _profitPerSecondText.text(`Profit per 20 second: ${profitPerSecond}`);
            
            setDiamonds();
            setProfitPerSecond();
            setProfitUpgradeCount();
            setProfitUpgradeCost();
        } else {
            alert("Not enough diamonds to upgrade profit per second!");
        }
    }
});

setInterval(() => {
    updateDiamonds(profitPerSecond);
}, 20000);
