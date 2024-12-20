// Upper window where user will type the words or click buttons
const arrowDownButtonTranslateOptions = document.querySelector('#arrow-down');
const chooseLanguageWindow = document.querySelector('.choose-language');
const searchLanguage = document.querySelector('#search');
const selectLanguageMenu = document.querySelector('.select-language select');
const languagesOffered = document.querySelector('.offered-langauges-while-typing');
const inputBoxTextArea = document.querySelector('.input-box');
const typeWords = document.querySelector('#input-text'); // area where I will type
const xDeleteBtn = document.querySelector('.x-delete');
const microphone = document.querySelector('#microphone');
const speakerType = document.querySelector('#speaker-type');
const titleOptions = document.querySelectorAll('.titles ul li');

// lower window where user will get the results of the translate and also click buttons for sound or copy etc
const titleOptions2= document.querySelectorAll('.titles-translate ul li');
const arrowDownButton2 = document.querySelector('#arrow-down-translate');
const chooseLanguageWindow2 = document.querySelector('.choose-language-translate');
const searchLanguage2 = document.querySelector('#search-language');
const selectLanguageMenu2 = document.querySelector('.select-language-translate select');
const languagesOffered2 = document.querySelector('.offered-langauges-while-typing-translate');
const translateBox = document.querySelector('.translate-box');
const translateLive = document.querySelector('.translate p');
const speaker = document.querySelector('#speaker');
const copy = document.querySelector('#copy');
const swapLanguages = document.querySelector('#swap-logo');

let isClicked = true;

// function that will transfer typed words onto the translate window
function typeTranslate (){
    translateLive.innerHTML = ``;
    typeWords.addEventListener('input',()=>{
        const text = typeWords.value;
        translateLive.innerHTML = `${text}`;

        console.log(text);
    })
}
typeTranslate()
// function that will choose the language when clicked one of top 3 options
function quickChoise(){
    titleOptions.forEach(option=> {

        option.addEventListener('click',(word)=>{
            titleOptions.forEach(title=> title.classList.remove('selected-language'));
            option.classList.add('selected-language');
            if(option.innerText === 'English'){
                selectLanguageMenu.value = 'English';
            } else if (option.innerText === 'Spanish'){
                selectLanguageMenu.value = 'Spanish';
            } else if (option.innerText === "French"){
                selectLanguageMenu.value = 'French';
            }
    })
})
}
quickChoise()

async function dictionaryApi(language, word){
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/${language}/${word}`);
    const data = await response.json();
    console.log(data);
}
dictionaryApi('en', 'hello')
