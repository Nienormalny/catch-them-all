$(document).ready(function () {
    $(window).on('resize', function () {
        if (window.orientation === 90 && window.innerWidth < 781) {
            console.log('smaller')
            var fragment = document.createDocumentFragment();
            var h1Tag = document.createElement('h1');
            h1Tag.innerHTML = 'please rotate your phone...';
            h1Tag.classList.add('message');

            fragment.appendChild(h1Tag);
            document.body.append(fragment);
            $('main').hide();
        } else {
            $('main').show();
            $('.message').remove();
        }
    });
    
    if (window.orientation === 90 && window.innerWidth < 781) {
        console.log('smaller')
        var fragment = document.createDocumentFragment();
        var h1Tag = document.createElement('h1');
        h1Tag.innerHTML = 'please rotate your phone...';
        h1Tag.classList.add('message');

        fragment.appendChild(h1Tag);
        document.body.append(fragment);
        $('main').hide();
    } else {
        $('main').show();
        $('.message').remove();
    }
    
    var mostLovedArray = [];
    // var firebaseConfig = {
    //     apiKey: '',
    //     authDomain: '',
    //     databaseURL: '',
    //     projectId: '',
    //     storageBucket: '',
    //     messagingSenderId: '',
    //     appId: '',
    //     measurementId:
    // };

    // firebase.initializeApp(firebaseConfig);
    // var dbRef = firebase.database();
    // var bestScore = dbRef.ref('bestscore');
    // var mostLoved = dbRef.ref('mostloved');
    // var statistics = dbRef.ref('statistics');
    var sortedData = [];
    // var ammountEase = 0;
    // var ammountNormal = 0;
    // var ammountHard = 0;
    var timer;
    var counting = true;
    var gameFinish = false;
    var seconds = 35;
    var score = 0;
    var clickCounter = 0;
    var selectedDificulty = 1;
    // var selectedLvlText = 'normal';
    // var selectedBackground = '';
    // var selectedBackgroundIndex = 0;
    // Seconds
    var lvlHardnest = {
    //  index: [speed, render amount]
        0: [8, 2],
        1: [6, 3],
        2: [5, 4]
    };
    var speed = lvlHardnest[1][0];
    var data = {};
    var avatars = [
        './assets/images/faces/avatar-1.png',
        './assets/images/faces/avatar-2.png',
        './assets/images/faces/avatar-3.png',
        './assets/images/faces/avatar-4.png'
    ];
    var backgrounds = [
        './assets/images/background/background-1.png',
        './assets/images/background/background-2.png',
        './assets/images/background/background-3.png',
        './assets/images/background/background-4.png',
        './assets/images/background/background-5.png',
    ]
    var rotate = [
        'rotate-left',
        'rotate-right'
    ];

    for (var i = 0; i < avatars.length; i++) {
        data[i] = 0;
    }

    var catchThemAllGame = 'CATCH THEM ALL';
    var catchThemAllDesc = "AND DON'T MISS ANY ONE";
    function iterateLetters(container, word, delay) {
        for (var l = 0; l < word.length; l++) {
            container.append('<span style="animation-delay: '+ l / delay +'s;">' + word.charAt(l) + '</span>');
        }
    }
    var counter = 3;

    iterateLetters($('#title'), catchThemAllGame, 6);
    iterateLetters($('#subtitle'), catchThemAllDesc, 4);

    // START - Explosion particles effect
    function renderParticles(posLeft, posTop, parAmount, parDistance) {
        var main = $('main');
        var particleFragment = document.createDocumentFragment();
        var particlesAmount = parAmount;
        
        function randomColor() {
            var colorsArray = [
                'rgb(3,0,0) radial-gradient(circle, rgba(51,6,6,1) 5%, rgba(167,19,19,1) 74%, rgba(156,14,14,1) 100%)',
            ];
            // to get random colors from array: colorsArray[Math.floor(Math.random() * colorsArray.length)]
            return colorsArray[0];
        }

        var getColor = randomColor();

        for (var i = 0; i < particlesAmount; i++) {
            var particleElement = document.createElement('div');
            particleElement.classList.add('particle-' + clickCounter);
            particleElement.style.left = posLeft + 'px';
            particleElement.style.top = posTop + 'px';
            particleElement.style.background = getColor;
            // to get rainbow colors of particle just uncoment it
            // particleElement.style.background = randomColor();
            particleFragment.append(particleElement);
        }

        main.append(particleFragment);
        
        function randomPosition(left, top) {
            function runRandomize(pos) {
                if (Math.floor(Math.random() * 2)) {
                    return pos - Math.random() * parDistance;
                } else {
                    return pos + Math.random() * parDistance;
                }
            }
            
            return {
                left: runRandomize(left),
                top: runRandomize(top)
            }
        }

        $('.particle-' + clickCounter).each(function () {
            var left = randomPosition($(this).position().left, $(this).position().top).left;
            var top = randomPosition($(this).position().left, $(this).position().top).top;
            var $this = $(this);

            $(this).css({
                left: left,
                top: top,
                opacity: 0,
                width: 0,
                height: 0
            });
            setTimeout(function () {
                $this.remove();
            }, 600);
        });
    }
    // END - Explosion particles effect

    // START - Time counter
    function startTimer() {
        var timeValue = $('#timer');
        if (seconds === 0) {
            gameFinish = true;
            clearTimeout(timer);
        } else {
            seconds--;
        }
        var fullTime = seconds;
        timeValue.text(fullTime);
        if (counting) {
            count();
        }
    }
    function count() {
        timer = setTimeout(function () {startTimer()}, 1000);
    }
    function startGameCounter() {
        $('#counter').removeClass('hidden');
        if (counter !== 0) {
            $('#counter').animate({
                fontSize: "0em"
            }, 1000, function () {
                counter--;
                $(this).text(counter);
                startGameCounter();
            })
        } else {
            $('#timer').removeClass('hidden');
            $('#score').removeClass('hidden');
            startTimer();
            fallingElements();
        }
    }
    // END - Time counter

    // START - Falling ellements
    function fallingElements() {
        var $gameContainer = $('#game-container');
        var randomTime = Math.floor(Math.random() * 1500);
        var randomElement = function () {
            return Math.floor(Math.random() * avatars.length);
        };
        var randomNumberOfElements = Math.floor(Math.random() * lvlHardnest[selectedDificulty][1]);
        var randomRotateIndex = Math.floor(Math.random() * rotate.length);
        var $elements = $(),
        numberOfElements = randomNumberOfElements;

        randomTimer = randomTime;

        for (var index = 0; index < numberOfElements; index++) {
            var randomIndex = randomElement();
            var $element = $(`<div class="element ${rotate[randomRotateIndex]}" data-element="${randomIndex}" draggable="false"><img draggable="false" data-element="${randomIndex}" style="opacity: 1 width: " src="${avatars[randomIndex]}" alt=""/></div>`);
            $element.css({
                'scale': Math.random() * 2,
                'left': ((Math.random() * ($gameContainer.width() - 120))) + 'px',
            });

            $elements = $elements.add($element);
        }

        $gameContainer.prepend($elements);

        $elements.animate({
            top: $('main').height() + 200,
        }, speed * 1000, function (el) {
            if (!$(this).hasClass('removed')) {
                score--;
            }
            $('#score').text(score);
            $(this).remove();
        });

        setTimeout(function () {
            if (gameFinish) {
                var toGetEasterEgg = [];
                Object.keys(data).map(function (el, i) {
                    if (data[el] !== 0) {
                        toGetEasterEgg.push({index: i, score: data[el]});
                    }
                });
                if (toGetEasterEgg.length === 1) {
                    var fragment = document.createDocumentFragment();
                    var element = document.createElement('div');
                    element.classList.add('easter-egg');
                    element.innerHTML = `
                        <img class="avatar" src="${avatars[toGetEasterEgg[0].index]}">
                        <h2 class="found">You found Easter Egg! BRAVO!</h2>
                        <h2 class="score">You clicked me ${toGetEasterEgg[0].score} times.</h2>
                        <h2 class="kiss">Let me kiss you!</h2>
                        <img class="heart" src="./assets/images/heart.png">
                    `;
                    fragment.append(element);
                    $('main').append(fragment);
                } else {
                    $('.finish').removeClass('hidden');
                    $('#background').removeClass('start-game');
                }
                $('#game-container').remove();

                for (var person in data) {
                    sortedData.push([person, data[person]]);
                }
                sortedData.sort(function (a, b) {
                    return b[1] - a[1];
                });
                sortedData.forEach((value) => {
                    var index = parseFloat(value[0]);
                    var points = value[1];
                    var image = $(`<div class="image"><img src="${avatars[index]}"><p>${points}</p></div>`);
                    $('#most-loved').append(image);
                    $('#end-score').text(score);
                    $('#save-end-score').text(score);
                    $('#score').addClass('hidden');
                    $('#timer').addClass('hidden');
                    $('#shaker').removeClass('shake');
                });
                clearTimeout(timer);
            } else {
                fallingElements();
            }
        }, 300);
    }

    $('main').on('mousedown', function (event) {
        var target = event.target;
        if (target.parentElement.classList.contains('element') || target.classList.contains('element')) {
            score++;
            clickCounter++;
            $('#score').text(score);
            data[$(target).data('element')] += 1;
            renderParticles(event.pageX, event.pageY, 10, 200);
            $(target).parent().addClass('removed');
        }
    });

    $('body').on('click', '#start-game', function () {
        $('.game-navigation').addClass('hidden');
        $('#top-three').addClass('hidden');
        $('#most-loved-score').addClass('hidden');
        $('.hard-description').addClass('hidden');
        $('#background').addClass('start-game');
        $('main').append('<div id="game-container"></div>')
        startGameCounter();
        // statistics.once('value', function (snap) {
        //     if (snap.val()) {
        //         if (snap.val().mostSelectedBackground[selectedBackground]) {
        //             statistics.child('mostSelectedBackground').child(selectedBackground).update({
        //                 backgroundIndex: selectedBackgroundIndex,
        //                 selectedTimes: snap.val().mostSelectedBackground[selectedBackground].selectedTimes + 1
        //             });
        //         } else {
        //             statistics.child('mostSelectedBackground').child(selectedBackground).set({
        //                 backgroundIndex: selectedBackgroundIndex,
        //                 selectedTimes: 1
        //             });
        //         }
        //         if (snap.val().playDificulty) {
        //             statistics.child('playDificulty').child(selectedLvlText.trim()).set(snap.val().playDificulty[selectedLvlText.trim()] ? (snap.val().playDificulty[selectedLvlText.trim()] + 1) : 1);
        //         } else {
        //             statistics.child('playDificulty').set({
        //                 [selectedLvlText.trim()]: 1
        //             });
        //         }
        //         if (snap.val().playTimes) {
        //             statistics.update({
        //                 playTimes: snap.val().playTimes + 1
        //             });
        //         } else {
        //             statistics.child('playTimes').set(1);
        //         }
        //     } else {
        //         statistics.set({
        //             mostSelectedBackground: {
        //                 [selectedBackground]: {
        //                     backgroundIndex: selectedBackgroundIndex,
        //                     selectedTimes: 1
        //                 }
        //             },
        //             playDificulty: {
        //                 [selectedLvlText]: 1
        //             }
        //         });
        //     }
        // });
        $('.footer').hide();
        $('.youtube').hide();
    });

    function nextBackground() {
        i = i + 1;
        i = i % backgrounds.length;
        return {selectedBg: backgrounds[i], index: i};
    }

    $('body').on('click', '#change-background', function () {
        var bg = nextBackground();
        selectedBackground = bg.selectedBg.split("/").splice(-1)[0].replace('.png', '');
        selectedBackgroundIndex = bg.index;

        $('main').css({
            'background-image': 'url(' + bg.selectedBg + ')'
        })
    });

    $('body').on('click', '#continue', function () {
        $('.finish').addClass('hidden');
        $('#save-score').removeClass('hidden');
    });

    $('body').on('click', '#save', function () {
        if ($('#name').val() !== '') {
            // bestScore.push({
            //     name: $('#name').val(),
            //     score: $('#save-end-score').text(),
            //     lvl: $('[data-lvl="' + selectedDificulty + '"]').text(),
            //     date: new Date().toISOString()
            // });

            // sortedData[0] - most hated
            // sortedData[0][0] - index of avatar
            // sortedData[0][1] - score of most hated

            // mostLoved.once('value', function (snap) {
            //     if (snap.val()) {
            //         Object.keys(snap.val()).map(function (val, ind) {
            //             var loveObj = snap.val()[val];

            //             if (avatars[sortedData[0][0]].split("/").splice(-1)[0].replace('.png', '').replace('-', ' ') === loveObj.name) {
            //                 mostLoved.child(val).update({clicked: parseInt(loveObj.clicked) + parseInt(sortedData[0][1])});
            //                 document.location.reload(true);
            //             }
            //         });
            //         if (!mostLovedArray.includes(avatars[sortedData[0][0]].split("/").splice(-1)[0].replace('.png', '').replace('-', ' '))) {
            //             mostLoved.push({
            //                 name: avatars[sortedData[0][0]].split("/").splice(-1)[0].replace('.png', '').replace('-', ' '),
            //                 image: avatars[sortedData[0][0]],
            //                 clicked: sortedData[0][1]
            //             });
            //             document.location.reload(true);
            //         }
            //     } else {
            //         mostLoved.push({
            //             name: avatars[sortedData[0][0]].split("/").splice(-1)[0].replace('.png', '').replace('-', ' '),
            //             image: avatars[sortedData[0][0]],
            //             clicked: sortedData[0][1]
            //         });
            //         document.location.reload(true);
            //     }
            // });
            document.location.reload(true);
        } else {
            $('#name').addClass('has-error');
        }
    });

    // bestScore.once('value', function (snap) {
    //     if (snap.val()) {
    //         var sortedScore = [];
    //         Object.keys(snap.val()).map(function (val, ind) {
    //             var bestScoreObj = snap.val()[val];
    //             sortedScore.push(bestScoreObj);
    //         });
    //         sortedScore.sort(function (a, b) {
    //             return b.score - a.score;
    //         });
    //         sortedScore.forEach(function (value, index) {
    //             var objScore = value.score;
    //             var objName = value.name;
    //             var objLvl = value.lvl;
    //             var objDate = new Date(value.date).toLocaleDateString();
    //             var fragment = document.createDocumentFragment();
    //             var element = document.createElement('tr');
                
    //             switch (objLvl) {
    //                 case 'easy':
    //                     if (ammountEase < 3) {
    //                         element.innerHTML = `
    //                             <td class="number">${ammountEase + 1}.</td>
    //                             <td class="name">${objName}</td>
    //                             <td class="score">${objScore}</td>
    //                             <td class="date">${objDate}</td>
    //                         `;
    //                         fragment.append(element);
    //                         $('#' + objLvl + ' .scores-tbody')[0].appendChild(fragment);
    //                         $('#top-three h3').removeAttr('style');
    //                         ammountEase++;
    //                     }
    //                     break;
    //                 case 'normal':
    //                     if (ammountNormal < 3) {
    //                         element.innerHTML = `
    //                             <td class="number">${ammountNormal + 1}.</td>
    //                             <td class="name">${objName}</td>
    //                             <td class="score">${objScore}</td>
    //                             <td class="date">${objDate}</td>
    //                         `;
    //                         fragment.append(element);
    //                         $('.scores-tbody', '#' + objLvl).append(fragment);
    //                         $('#top-three h3').removeAttr('style');
    //                         ammountNormal++;
    //                     }
    //                     break;
    //                 case 'hard':
    //                     if (ammountHard < 3) {
    //                         element.innerHTML = `
    //                             <td class="number">${ammountHard + 1}.</td>
    //                             <td class="name">${objName}</td>
    //                             <td class="score">${objScore}</td>
    //                             <td class="date">${objDate}</td>
    //                         `;
    //                         fragment.append(element);
    //                         $('.scores-tbody', '#' + objLvl).append(fragment);
    //                         $('#top-three h3').removeAttr('style');
    //                         ammountHard++;
    //                     }
    //                     break;
    //                 default: false;
    //             }
    //         });
    //     }
    // });

    // mostLoved.on('value', function (snap) {
    //     if (snap.val()) {
    //         var sortLoved = [];
    //         Object.keys(snap.val()).map(function (val, ind) {
    //             var mostLovedObj = snap.val()[val];
    //             sortLoved.push(mostLovedObj);
    //         });
    //         sortLoved.sort(function (a, b) {
    //             return b.clicked - a.clicked;
    //         });
            
    //         sortLoved.forEach(function (value, index) {
    //             var objScore = value.clicked;
    //             var objName = value.name;
    //             var objImage = value.image;
    //             var fragment = document.createDocumentFragment();
    //             var element = document.createElement('div');

    //             mostLovedArray.push(objName);

    //             element.classList.add('item');
    //             element.innerHTML = `
    //                     <div class="number">${index + 1}.</div>
    //                     <div class="name"><img src="${objImage}"> ${objName}</div>
    //                     <div class="score">${objScore}</div>
    //             `;
    //             if (index < 3) {
    //                 fragment.append(element);
    //                 document.getElementById('most-loved-tbody').appendChild(fragment);
    //             }
    //         });
    //     }
    // });

    $('body').on('click', '.top-three', function () {
        $('#top-three table').toggleClass('collapsed');
        $('#top-three h3').toggleClass('collapsed');
        if ($('#most-loved-score .flex-container').hasClass('collapsed')) {
            $('body main').toggleClass('collapse-open');
        }
    });

    $('body').on('click', '.most-loved', function () {
        $('#most-loved-score .flex-container').toggleClass('collapsed');
        $('#most-loved-score h3').toggleClass('collapsed');
        if ($('#top-three table').hasClass('collapsed')) {
            $('body main').toggleClass('collapse-open');
        }
    });

    $('body').on('click', '#select-lvl > span', function () {
        $(this).addClass('selected');
        selectedDificulty = parseFloat($(this).data('lvl'));
        selectedLvlText = $(this).text()
        speed = lvlHardnest[selectedDificulty][0];
        $('#select-lvl > span').not($(this)).removeClass('selected');
    });

    var randomBGIndex = Math.floor(Math.random() * backgrounds.length);
    selectedBackground = backgrounds[randomBGIndex].split("/").splice(-1)[0].replace('.png', '');
    selectedBackgroundIndex = randomBGIndex;

    $('main').css({
        'background-image': 'url(' + backgrounds[randomBGIndex] + ')'
    });
});