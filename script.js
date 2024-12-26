import {languages} from './languages.js';

// Upper window where user will type the words or click buttons
const detectLanguage = document.querySelector('#detect-language');
const arrowDownButtonTranslateOptions = document.querySelector('#arrow-down');
const chooseLanguageWindow = document.querySelector('.choose-language');
const searchLanguage = document.querySelector('#search');
const selectLanguageMenu = document.querySelector('#select-option');
const languagesOffered = document.querySelector('.offered-langauges-while-typing ul');
const inputBoxTextArea = document.querySelector('.input-box');
const typeWords = document.querySelector('#input-text'); // area where I will type
const xDeleteBtn = document.querySelector('.x-delete');
const microphone = document.querySelector('#microphone');
const speakerType = document.querySelector('#speaker-type');
const titleOptions = document.querySelectorAll('.titles ul li');

// lower window where user will get the results of the translate and also click buttons for sound or copy etc
const word = document.querySelector('#word-dic');
const phonetic = document.querySelector('#phonetic-dic');
const definition = document.querySelector('#definition');
const speaker = document.querySelector('#speaker');
const copy = document.querySelector('#copy');

let chosenLanguage;



// function that will choose the language when clicked one of top 3 options
function quickChoise(){
    titleOptions.forEach(option=> {
        option.addEventListener('click',()=>{
            titleOptions.forEach(title=> title.classList.remove('selected-language'));
            option.classList.add('selected-language');
            if(option.innerText === 'English'){
                selectLanguageMenu.value = 'English';
                chosenLanguage = 'en';
            } else if (option.innerText === 'Spanish'){
                chosenLanguage = 'es';
                selectLanguageMenu.value = 'Spanish';
            } else if (option.innerText === "French"){
                selectLanguageMenu.value = 'French';
                chosenLanguage = 'fr';
            }
        })
    })
}
quickChoise()


// Drop window when pressed on Arrow down button to choose languages
arrowDownButtonTranslateOptions.addEventListener('click', (e)=>{
    e.stopPropagation(); // Prevent this click from being detected by the window click listener
    if(chooseLanguageWindow.classList.contains('hidden')){
        chooseLanguageWindow.classList.remove('hidden');
        inputBoxTextArea.classList.add('hidden')
        listOfLanguages()
    } else {
        closeLanguagesWindow()
    }
})

// Function that will close the languages window
function closeLanguagesWindow(){
    chooseLanguageWindow.classList.add('hidden');
    inputBoxTextArea.classList.remove('hidden');
}

// Event listener to close the window when clicking outside of it
window.addEventListener('click',(e)=>{
    // Check if the modal is open and the click target is not the modal or any of its children
    if (!chooseLanguageWindow.classList.contains('hidden') && !chooseLanguageWindow.contains(e.target)){
        closeLanguagesWindow()
    }
})



// Change event that will capture the selected language from a drop down window, 
// and populate the search language input with the selected language
selectLanguageMenu.addEventListener('change', (e)=>{
    searchLanguage.value = '';
    const selectedLan = (e.target.value).toLowerCase();
    searchLanguage.value = `${selectedLan}`;
    
})


// function that will show the list of languages when the window is open, each language offered is 
// a list item in the list of languages and has a click event
function listOfLanguages(filteredLanguages = Object.values(languages)) {
    // Clear the existing list to prevent duplicates
    languagesOffered.innerHTML = '';

    // Populate the list with filtered languages
    filteredLanguages.forEach(language => {
        const li = document.createElement('li');
        li.textContent = language;
        languagesOffered.appendChild(li);

        // Add click event listener to each language item
        li.addEventListener('click', () => {
            // Find the key associated with the selected language
            const languageKey = Object.keys(languages).find(key => languages[key] === language);

            if (languageKey) { // Ensure the key is found before using it
                selectLanguageMenu.value = languageKey;
                searchLanguage.value = language;
                detectLanguage.innerText = language;
                chosenLanguage = languageKey.toLowerCase();
                console.log('List of Languages:', chosenLanguage)
       
                closeLanguagesWindow();
            } else {
                console.error(`Language key for "${language}" not found.`);
            }
        });
    });
}

// function that will dynamically filter throught offered languages while I am typing the language name
function chosenLanguageFromWindow (){
    searchLanguage.addEventListener('input', ()=>{
        const search = searchLanguage.value.toLowerCase();
        const values = Object.values(languages);

        // Filtering through the object values of the object of languages while searching in the search bar
        const filteredLanguages = values.filter((language) => language.toLowerCase().startsWith(search)); 
        
        if( search === ''){
            listOfLanguages(values.slice(0, 18));
        } else {
            listOfLanguages(filteredLanguages);
        }
        console.log(filteredLanguages) 

        console.log(search)
    })

}
chosenLanguageFromWindow()
listOfLanguages();




// function that will transfer typed words onto the translate window
function typeTranslate() {
  typeWords.addEventListener('input', async () => {
    const text = typeWords.value.trim();

    if (text === '') {
      word.textContent = '';
      phonetic.textContent = '';
      definition.textContent = '';
      return;
    }

    if (!chosenLanguage) {
      console.error('Please select a language');
      return;
    }

    const translatedData = await dictionaryApi(chosenLanguage, text);

    if (!translatedData) {
      word.textContent = 'Word not found';
      phonetic.textContent = '';
      definition.textContent = '';
      return;
    }

    word.textContent = translatedData.word;
    phonetic.textContent = translatedData.phonetics;
    definition.textContent = translatedData.definition;
  });
}
typeTranslate()

async function dictionaryApi(lang, word) {
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/${lang}/${word}`);
    if (!response.ok) {
      // Handle non-2xx HTTP responses
      if (response.status === 404) {
        return { error: "Word not found" }; // Specific message for 404
      }
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    if (!data || data.length === 0) {
      return { error: "No data found" };
    }

    const firstEntry = data[0];

    let phoneticText = "Phonetics not available"; // Default message

    if (firstEntry.phonetics && firstEntry.phonetics.length > 0) {
        for(const phonetic of firstEntry.phonetics){
            if(phonetic.text){
                phoneticText = phonetic.text;
                break;
            }
        }
    }

    const definition = firstEntry.meanings?.[0]?.definitions?.[0]?.definition || "Definition not available";

    return { word: firstEntry.word, definition: definition, phonetics: phoneticText };
  } catch (error) {
    console.error("API request error:", error);
    return { error: "API request failed" };
  }
}



