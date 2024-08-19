// DOM
const swiper = document.querySelector('#swiper');
const like = document.querySelector('#like');
const dislike = document.querySelector('#dislike');

const likeSound = document.querySelector('#likeSound');
const dislikeSound = document.querySelector('#dislikeSound');

const playSound = (sound) => {
  sound.currentTime = 0;  // Reset playback to the start
  sound.play();  // Play the sound
};

let cardCount = 0;
let currentPage = 1;
const cardsPerPage = 5;

// Fetch data from Flask with pagination
async function fetchData(page = 1, limit = 5) {
  try {
    console.log('Fetching data...');
    const response = await fetch(`/data?page=${page}&limit=${limit}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log('Data fetched:', data); // Log the fetched data
    return data;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    return [];
  }
}

// Create and append cards
async function appendNewCard() {
  console.log('appendNewCard called'); // Confirm function is called
  const data = await fetchData(currentPage, cardsPerPage);
  if (!data || data.length === 0) {
    console.error('No data received or data is empty');
    return;
  }

  data.forEach(item => {
    console.log('Creating card for:', item.Title);
    const card = new Card({
      title: item.Title,
      description: item.Description,
      link: item.Link,
      onDismiss: counter,
      onLike: () => {
        like.style.animationPlayState = 'running';
        like.classList.toggle('trigger');
        playSound(likeSound);
        saveData(item.Title, item.Link, 'Read')
        console.log('like')
      },
      onDislike: () => {
        dislike.style.animationPlayState = 'running';
        dislike.classList.toggle('trigger');
        playSound(dislikeSound);
        saveData(item.Title, item.Link, 'Not Read')
        console.log('dislike')
      }
    });
    console.log('Appending card:', card);
    swiper.append(card.element);
  });

  refreshCards();
  
  // Increment page number for next batch
  currentPage++;
}

// refactored from the above
function refreshCards() {

    // Update card indices
    const cards = swiper.querySelectorAll('.card:not(.dismissing)');
    cards.forEach((card, index) => {
      card.style.setProperty('--i', index);
    });
    console.log('Cards appended and indices updated');
}

async function saveData(title,link,status) {
  //get data
  try {
    const response = await fetch('/save_data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, link, status }),
    });

    if (response.ok) {
        console.log('Data saved successfully');
    } else {
        console.error('Failed to save data');
    }
} catch (error) {
    console.error('Error:', error);
}
}

// help
function counter() {
  refreshCards();
  cardCount++;
  console.log(cardCount)
  if (cardCount === cardsPerPage) {
    cardCount = 0;
    appendNewCard();
    console.log(cardCount)
  }
}

appendNewCard();
