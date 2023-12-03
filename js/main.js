const texts = {
    '1.jpg': 'Sweet Bonanza1',
    '2.jpg': 'Sweet Bonanza2',
    '3.jpg': 'Sweet Bonanza3',
    '4.jpg': 'Sweet Bonanza4'
}

const imgs = Object.keys(texts)

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function getTwoRandomImgs() {
    const index1 = getRandomInt(0, imgs.length - 1)
    let index2 = getRandomInt(0, imgs.length - 1)
    if (index1 === index2) {
        index2 = (index2 + 1) % imgs.length
    }
    const img1 = imgs[index1]
    const img2 = imgs[index2]
    const text1 = texts[img1]
    const text2 = texts[img2]

    const res1 = { src: `img/${img1}`, text: text1 }
    const res2 = { src: `img/${img2}`, text: text2 }

    return [res1, res2]
}

//fake buttons click only one
const btnsTip = document.querySelectorAll(".fake-btn");
let activeBtn = null;

btnsTip.forEach((btnTip) => {
    btnTip.addEventListener("click", (e) => {
        e.currentTarget.classList.add("btn-active");

        if ((activeBtn != null && activeBtn !== e.currentTarget)) {
            activeBtn.classList.remove("btn-active");
        }
        activeBtn = e.currentTarget;
    });
});

//progress bar

const progressContainers = document.querySelectorAll('.progress-bar-container')
const progresessList = Array(progressContainers.length).fill(false)
progressContainers.forEach((containerEl, index) => {
    const barElem = containerEl.querySelector('.progress-bar')
    const checkboxElem = containerEl.querySelector('.progress-checkbox')
    const textElem = containerEl.querySelector('.progress-text')
    const onChanged = (value) => {
        progresessList[index] = value
        const allDone = progresessList.every(flag => flag)
        const twoBarsDone = progresessList[0] && progresessList[1]

        if (twoBarsDone) {
            const [btn1, btn2] = getTwoRandomImgs()
            document.getElementById('btn1').innerHTML = btn1.text
            document.getElementById('btn2').innerHTML = btn2.text
            document.getElementById('img-1').src = btn1.src
            document.getElementById('img-2').src = btn2.src

            document.querySelectorAll('.btn-img').forEach(element => element.classList.add('visible'))
        }

        if (allDone) {
            document.querySelector('.button').classList.add('active');
        }
    }
    initLoadbar(barElem, checkboxElem, textElem, onChanged, true)
})

function initLoadbar(barElem, checkboxElem, textElem, onChanged, toogleOnce = false) {
    let toogleProcessing = false
    function toogleLoadbar() {
        return new Promise((resolve) => {
            if (toogleProcessing) return
            toogleProcessing = true
            const willOff = barElem.classList.contains('load')
            const finalPercent = willOff ? 0 : 100
            // console.log('toogle loadbar', willOff ? 'off' : 'on')

            const parent = barElem.parentElement
            const parentRect = parent.getBoundingClientRect();

            const changeUiPercent = (percent) => textElem.innerHTML = `${percent}%`

            const interval = setInterval(function () {
                const rect = barElem.getBoundingClientRect();

                const percent = Math.min(Math.trunc(rect.width / parentRect.width * 100), 100)
                // console.log('progress changed', percent)
                changeUiPercent(percent)
            }, 10);

            const onTransitionEnded = () => {
                barElem.removeEventListener("transitionend", onTransitionEnded);
                clearInterval(interval)
                changeUiPercent(finalPercent)
                toogleProcessing = false
                const isOn = finalPercent === 100
                onChanged(isOn)
                resolve()
            }

            barElem.addEventListener("transitionend", onTransitionEnded);

            barElem.classList.toggle('load');
        })
    }

    const checkboxInputElem = checkboxElem.querySelector('input')

    const waitTime = (timeout) => {
        return new Promise((resolve) => setTimeout(resolve, timeout))
    }

    checkboxElem.onclick = async () => {
        if (checkboxInputElem.disabled) return
        await waitTime(100)
        checkboxInputElem.disabled = true
        await toogleLoadbar()

        if (!toogleOnce) {
            checkboxInputElem.disabled = false
        }
    }
}