class WishlistGenerator {
    constructor() {
        this.form = document.getElementById('wishlistForm');
        this.loadingContainer = document.getElementById('loadingContainer');
        this.wishlistContainer = document.getElementById('wishlistContainer');
        this.errorContainer = document.getElementById('errorContainer');
        this.wishlistItems = document.getElementById('wishlistItems');
        this.regenerateBtn = document.getElementById('regenerateBtn');
        this.retryBtn = document.getElementById('retryBtn');
        this.errorText = document.getElementById('errorText');
        
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.regenerateBtn.addEventListener('click', () => this.regenerateWishlist());
        this.retryBtn.addEventListener('click', () => this.hideError());
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const age = document.getElementById('age').value;
        const interest = document.getElementById('interest').value;
        
        if (!age || !interest.trim()) {
            this.showError('Please fill in both age and interests!');
            return;
        }

        await this.generateWishlist(age, interest);
    }

    async generateWishlist(age, interest) {
        this.showLoading();
        
        try {
            const wishlist = await this.callLLM(age, interest);
            this.displayWishlist(wishlist);
        } catch (error) {
            console.error('Error generating wishlist:', error);
            this.showError('Sorry, I had trouble generating your wishlist. Please try again!');
        }
    }

    async callLLM(age, interest) {
        // For demo purposes, I'll create a mock LLM response
        // In a real implementation, you would call GitHub Models API or another LLM service
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Mock response based on age and interest
        const wishlistItems = this.generateMockWishlist(age, interest);
        
        return wishlistItems;
    }

    generateMockWishlist(age, interest) {
        // This is a simplified mock - in reality, you'd use an actual LLM API
        const baseItems = [
            {
                name: "Premium Notebook Set",
                description: "Beautiful leather-bound notebooks perfect for writing down thoughts, sketches, or planning adventures."
            },
            {
                name: "Cozy Reading Blanket",
                description: "Ultra-soft blanket perfect for curling up with a good book or movie on lazy afternoons."
            },
            {
                name: "Artisan Tea Collection",
                description: "Curated selection of premium teas from around the world to enjoy during quiet moments."
            },
            {
                name: "Bluetooth Wireless Earbuds",
                description: "High-quality earbuds for listening to music, podcasts, or audiobooks anywhere you go."
            },
            {
                name: "Desktop Succulent Garden",
                description: "Low-maintenance plants that add life and color to any workspace or room."
            },
            {
                name: "Gourmet Chocolate Box",
                description: "Assortment of artisanal chocolates for those special treat-yourself moments."
            },
            {
                name: "Aromatherapy Candle Set",
                description: "Soy candles with calming scents like lavender, vanilla, and eucalyptus for relaxation."
            },
            {
                name: "Portable Phone Charger",
                description: "Sleek power bank to keep your devices charged during busy days and travels."
            },
            {
                name: "Recipe Inspiration Book",
                description: "Beautiful cookbook with easy, delicious recipes to try in the kitchen."
            },
            {
                name: "Streaming Service Gift Card",
                description: "Credit for your favorite streaming platform to discover new shows and movies."
            }
        ];

        // Customize based on interests
        const interestLower = interest.toLowerCase();
        const customItems = [];

        if (interestLower.includes('read') || interestLower.includes('book')) {
            customItems.push({
                name: "Book Subscription Box",
                description: "Monthly delivery of carefully selected books based on your reading preferences."
            });
        }

        if (interestLower.includes('music') || interestLower.includes('guitar') || interestLower.includes('piano')) {
            customItems.push({
                name: "Premium Music Streaming Subscription",
                description: "High-quality music streaming with access to millions of songs and exclusive content."
            });
        }

        if (interestLower.includes('cook') || interestLower.includes('baking') || interestLower.includes('food')) {
            customItems.push({
                name: "Professional Chef's Knife",
                description: "High-quality kitchen knife that makes cooking more enjoyable and efficient."
            });
        }

        if (interestLower.includes('travel') || interestLower.includes('adventure')) {
            customItems.push({
                name: "Travel Journal & Accessories",
                description: "Beautiful travel journal with maps, stickers, and pockets for memories."
            });
        }

        if (interestLower.includes('game') || interestLower.includes('gaming')) {
            customItems.push({
                name: "Gaming Headset",
                description: "Comfortable headset with excellent sound quality for gaming sessions."
            });
        }

        if (interestLower.includes('art') || interestLower.includes('draw') || interestLower.includes('paint')) {
            customItems.push({
                name: "Premium Art Supply Set",
                description: "Professional-grade art supplies including pencils, paints, and sketchbooks."
            });
        }

        if (interestLower.includes('fitness') || interestLower.includes('yoga') || interestLower.includes('exercise')) {
            customItems.push({
                name: "Yoga Mat & Accessories",
                description: "High-quality yoga mat with blocks and straps for a complete practice."
            });
        }

        if (interestLower.includes('tech') || interestLower.includes('computer') || interestLower.includes('coding')) {
            customItems.push({
                name: "Mechanical Keyboard",
                description: "Premium mechanical keyboard for a satisfying typing experience."
            });
        }

        // Age-based customization
        if (age < 18) {
            customItems.push({
                name: "Study Planner & Stationery",
                description: "Colorful planner and premium pens to stay organized with school and activities."
            });
        } else if (age >= 18 && age <= 30) {
            customItems.push({
                name: "Coffee Subscription",
                description: "Monthly delivery of specialty coffee beans from around the world."
            });
        } else {
            customItems.push({
                name: "Luxury Bath Set",
                description: "Premium bath bombs, salts, and lotions for ultimate relaxation."
            });
        }

        // Combine and shuffle items
        const allItems = [...baseItems, ...customItems];
        const shuffled = allItems.sort(() => 0.5 - Math.random());
        
        return shuffled.slice(0, 10);
    }

    displayWishlist(items) {
        this.hideAll();
        
        this.wishlistItems.innerHTML = '';
        
        items.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'wishlist-item';
            itemElement.innerHTML = `
                <div class="item-name">${item.name}</div>
                <div class="item-description">${item.description}</div>
            `;
            this.wishlistItems.appendChild(itemElement);
        });
        
        this.wishlistContainer.classList.remove('hidden');
    }

    showLoading() {
        this.hideAll();
        this.loadingContainer.classList.remove('hidden');
    }

    showError(message) {
        this.hideAll();
        this.errorText.textContent = message;
        this.errorContainer.classList.remove('hidden');
    }

    hideError() {
        this.errorContainer.classList.add('hidden');
    }

    hideAll() {
        this.loadingContainer.classList.add('hidden');
        this.wishlistContainer.classList.add('hidden');
        this.errorContainer.classList.add('hidden');
    }

    async regenerateWishlist() {
        const age = document.getElementById('age').value;
        const interest = document.getElementById('interest').value;
        
        if (age && interest) {
            await this.generateWishlist(age, interest);
        }
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new WishlistGenerator();
});