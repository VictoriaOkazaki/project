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
        // console.log('loadbar changed allDone', allDone, progresessList)
        if (allDone) {
            // console.log('all done change btns text')
            document.getElementById('btn1').innerHTML = 'Book of Ra'
            document.getElementById('btn2').innerHTML = 'Sweet Bonanza'
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