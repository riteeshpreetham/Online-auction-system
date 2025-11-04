// Core Auction Data (Simulating a database fetch)
const auctions = [
    { id: 1, title: 'Antique Vase', description: 'A beautiful antique vase from the 18th century.', currentBid: 150, endTime: '2025-11-06 18:00', image: 'https://i.etsystatic.com/22187040/r/il/052acd/5896400719/il_fullxfull.5896400719_azvl.jpg' },
    { id: 2, title: 'Vintage Car', description: 'A classic vintage car in excellent condition.', currentBid: 5000, endTime: '2025-11-10 21:00', image: 'https://hips.hearstapps.com/townandcountry/assets/16/14/1954-mercedes-300sl-gullwing-a_1.jpg' }
];

// Function to calculate and format the time remaining (Dynamic Countdown)
function formatTimeRemaining(endTime) {
    const total = Date.parse(endTime) - Date.parse(new Date());
    if (total <= 0) {
        return 'Auction Ended';
    }

    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

// Function to update all countdown timers
function updateTimers() {
    document.querySelectorAll('.countdown-timer').forEach(timerElement => {
        const endTime = timerElement.dataset.endTime;
        const timeRemaining = formatTimeRemaining(endTime);
        timerElement.textContent = `Time Remaining: ${timeRemaining}`;
        
        // Optional: Disable bidding when auction ends
        if (timeRemaining === 'Auction Ended') {
            const auctionItem = timerElement.closest('.auction-item');
            const bidForm = auctionItem.querySelector('.bid-form');
            if (bidForm && bidForm.style.display !== 'none') {
                bidForm.innerHTML = '<p style="color: red; font-weight: bold;">Bidding Closed</p>';
            }
        }
    });
}


document.addEventListener('DOMContentLoaded', () => {
    const auctionList = document.getElementById('auction-list');

    // 1. Render Auction Items
    auctions.forEach(auction => {
        const auctionItem = document.createElement('div');
        auctionItem.className = 'auction-item';
        auctionItem.setAttribute('data-auction-id', auction.id); 
        auctionItem.innerHTML = `
            <img src="${auction.image}" alt="${auction.title}">
            <div class="auction-details">
                <h3>${auction.title}</h3>
                <p>${auction.description}</p>
                <p>
                    Current Bid: 
                    <span class="current-bid-amount" data-auction-id="${auction.id}">$${auction.currentBid.toLocaleString()}</span>
                </p>
                <p class="countdown-timer" data-end-time="${auction.endTime}">Loading Timer...</p>
                <form class="bid-form" data-auction-id="${auction.id}">
                    <input type="number" name="bidAmount" placeholder="Enter your bid (Min: $${auction.currentBid + 1})" min="${auction.currentBid + 1}" required>
                    <button type="submit">Place Bid</button>
                </form>
            </div>
        `;
        auctionList.appendChild(auctionItem);
    });

    // Initial timer call and set interval for live update
    updateTimers();
    setInterval(updateTimers, 1000);

    // 2. Handle Bid Form Submissions
    document.querySelectorAll('.bid-form').forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const auctionId = parseInt(form.dataset.auctionId);
            const bidInput = form.querySelector('input[name="bidAmount"]');
            const bidAmount = parseFloat(bidInput.value);
            
            const auction = auctions.find(a => a.id === auctionId);
            
            // Check if the bid is valid (greater than current bid)
            if (bidAmount <= auction.currentBid) {
                alert(`Your bid must be higher than the current bid of $${auction.currentBid.toLocaleString()}.`);
                return; 
            }

            // Update Data (Client-side simulation)
            auction.currentBid = bidAmount;
            
            // Update UI (Dynamic Look)
            const currentBidSpan = document.querySelector(`.current-bid-amount[data-auction-id="${auctionId}"]`);
            if (currentBidSpan) {
                currentBidSpan.textContent = `$${bidAmount.toLocaleString()}`;
            }
            
            // Update Min Bid and Clear Input
            bidInput.setAttribute('min', bidAmount + 1);
            bidInput.setAttribute('placeholder', `Enter your bid (Min: $${bidAmount + 1})`);
            bidInput.value = ''; // Clear the input field for better UX

            alert(`Success! Your bid of $${bidAmount.toLocaleString()} is now the highest on the ${auction.title}.`);
            // In a real application, AJAX request goes here.
        });
    });

    // 3. Handle Contact Form Submission
    document.getElementById('contact-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = e.target.name.value;
        const email = e.target.email.value;
        const message = e.target.message.value;
        alert(`Message sent from ${name} (${email}): ${message}`);
        e.target.reset(); // Clear form after submission
        // In a real application, AJAX request goes here.
    });
});
