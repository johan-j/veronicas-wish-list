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
        
        // GitHub Models API configuration
        this.apiEndpoint = 'https://models.inference.ai.azure.com/chat/completions';
        this.modelName = 'gpt-4o-mini';
        
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.regenerateBtn.addEventListener('click', () => this.regenerateWishlist());
        this.retryBtn.addEventListener('click', () => this.hideError());
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const apiKey = document.getElementById('apiKey').value;
        const age = document.getElementById('age').value;
        const interest = document.getElementById('interest').value;
        
        if (!apiKey || !apiKey.trim()) {
            this.showError('Please provide a GitHub Models API key!');
            return;
        }
        
        if (!age || !interest.trim()) {
            this.showError('Please fill in both age and interests!');
            return;
        }

        await this.generateWishlist(apiKey, age, interest);
    }

    async generateWishlist(apiKey, age, interest) {
        this.showLoading();
        
        try {
            const wishlist = await this.callGitHubModels(apiKey, age, interest);
            this.displayWishlist(wishlist);
        } catch (error) {
            console.error('Error generating wishlist:', error);
            let errorMessage = 'Sorry, I had trouble generating your wishlist. Please try again!';
            
            if (error.message.includes('401') || error.message.includes('unauthorized')) {
                errorMessage = 'Invalid API key. Please check your GitHub Models API key and try again.';
            } else if (error.message.includes('429')) {
                errorMessage = 'Rate limit exceeded. Please wait a moment and try again.';
            } else if (error.message.includes('network') || error.message.includes('fetch')) {
                errorMessage = 'Network error. Please check your internet connection and try again.';
            }
            
            this.showError(errorMessage);
        }
    }

    async callGitHubModels(apiKey, age, interest) {
        const prompt = `You are a helpful assistant that creates personalized wishlists. Create a wishlist of exactly 10 items for someone who is ${age} years old and interested in: ${interest}.

Each item should be:
- Age-appropriate and suitable for their interests
- Realistic and obtainable
- Have a clear name (2-6 words)
- Have a helpful description (1-2 sentences)

Please respond with a JSON array of exactly 10 objects, each with "name" and "description" fields. Make the items diverse and interesting, covering different price ranges and categories related to their interests.

Example format:
[
  {
    "name": "Premium Notebook Set",
    "description": "High-quality leather-bound notebooks perfect for journaling and creative writing."
  }
]

Only return the JSON array, no other text.`;

        const requestBody = {
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant that creates personalized wishlists based on age and interests. Always respond with valid JSON only."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: this.modelName,
            temperature: 0.8,
            max_tokens: 2000,
            top_p: 1
        };

        const response = await fetch(this.apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            throw new Error('Invalid response format from API');
        }

        const content = data.choices[0].message.content.trim();
        
        try {
            // Try to parse the JSON response
            const wishlistItems = JSON.parse(content);
            
            if (!Array.isArray(wishlistItems) || wishlistItems.length === 0) {
                throw new Error('Invalid wishlist format');
            }
            
            // Ensure we have exactly 10 items and they have the correct format
            const validItems = wishlistItems
                .filter(item => item && item.name && item.description)
                .slice(0, 10);
                
            if (validItems.length < 5) {
                throw new Error('Not enough valid items generated');
            }
            
            return validItems;
            
        } catch (parseError) {
            console.error('Failed to parse LLM response:', content);
            // Fallback: try to extract items from text response
            return this.parseTextResponse(content, age, interest);
        }
    }

    parseTextResponse(content, age, interest) {
        // Fallback parser for when LLM doesn't return valid JSON
        const lines = content.split('\\n').filter(line => line.trim());
        const items = [];
        
        let currentItem = {};
        
        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;
            
            // Look for numbered items or items starting with - or *
            if (/^\\d+\\.|^[-*]/.test(trimmed)) {
                if (currentItem.name) {
                    items.push(currentItem);
                }
                currentItem = {
                    name: trimmed.replace(/^\\d+\\.|^[-*]\\s*/, '').replace(/[:.].*$/, '').trim(),
                    description: trimmed.replace(/^\\d+\\.|^[-*]\\s*[^:.]+([:.]\\s*)?/, '').trim() || 'A great item for your wishlist!'
                };
            } else if (currentItem.name && !currentItem.description) {
                currentItem.description = trimmed;
            }
        }
        
        if (currentItem.name) {
            items.push(currentItem);
        }
        
        // If we still don't have enough items, generate some fallback items
        if (items.length < 5) {
            return this.generateFallbackWishlist(age, interest);
        }
        
        return items.slice(0, 10);
    }

    generateFallbackWishlist(age, interest) {
        // Fallback wishlist generator when API fails
        const interestLower = interest.toLowerCase();
        const items = [];
        
        // Base items that work for most people
        const baseItems = [
            { name: "Premium Notebook Set", description: "High-quality notebooks perfect for writing, sketching, or planning." },
            { name: "Bluetooth Wireless Earbuds", description: "High-quality earbuds for music, podcasts, and calls on the go." },
            { name: "Cozy Reading Blanket", description: "Ultra-soft blanket perfect for relaxing and unwinding at home." },
            { name: "Artisan Tea or Coffee Collection", description: "Curated selection of premium beverages to enjoy during quiet moments." },
            { name: "Desktop Plant Set", description: "Low-maintenance plants that add life and color to any space." }
        ];
        
        items.push(...baseItems);
        
        // Interest-specific items
        if (interestLower.includes('read') || interestLower.includes('book')) {
            items.push({ name: "Book Subscription Box", description: "Monthly delivery of carefully selected books based on your preferences." });
        }
        
        if (interestLower.includes('music') || interestLower.includes('guitar') || interestLower.includes('piano')) {
            items.push({ name: "Music Streaming Premium Subscription", description: "Access to millions of songs and exclusive content." });
        }
        
        if (interestLower.includes('cook') || interestLower.includes('baking') || interestLower.includes('food')) {
            items.push({ name: "Professional Chef's Knife", description: "High-quality kitchen knife that makes cooking more enjoyable." });
        }
        
        if (interestLower.includes('art') || interestLower.includes('draw') || interestLower.includes('paint')) {
            items.push({ name: "Professional Art Supply Set", description: "Premium art supplies including pencils, paints, and paper." });
        }
        
        if (interestLower.includes('fitness') || interestLower.includes('yoga') || interestLower.includes('exercise')) {
            items.push({ name: "Yoga Mat & Accessories", description: "Complete yoga set with mat, blocks, and straps." });
        }
        
        // Age-appropriate additions
        if (age < 18) {
            items.push({ name: "Study Planner & Stationery", description: "Organized planner and premium pens for school success." });
        } else if (age >= 18 && age <= 30) {
            items.push({ name: "Coffee Subscription", description: "Monthly delivery of specialty coffee beans from around the world." });
        } else {
            items.push({ name: "Luxury Bath Set", description: "Premium bath products for ultimate relaxation and self-care." });
        }
        
        // Generic items to fill up to 10
        const fillerItems = [
            { name: "Portable Phone Charger", description: "Reliable power bank to keep your devices charged anywhere." },
            { name: "Aromatherapy Candle Set", description: "Soy candles with calming scents for relaxation." },
            { name: "Gourmet Chocolate Box", description: "Assortment of artisanal chocolates for special moments." }
        ];
        
        items.push(...fillerItems);
        
        return items.slice(0, 10);
    }

    displayWishlist(items) {
        this.hideAll();
        
        this.wishlistItems.innerHTML = '';
        
        items.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'wishlist-item';
            itemElement.innerHTML = `
                <div class="item-name">${this.escapeHtml(item.name)}</div>
                <div class="item-description">${this.escapeHtml(item.description)}</div>
            `;
            this.wishlistItems.appendChild(itemElement);
        });
        
        this.wishlistContainer.classList.remove('hidden');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
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
        const apiKey = document.getElementById('apiKey').value;
        const age = document.getElementById('age').value;
        const interest = document.getElementById('interest').value;
        
        if (apiKey && age && interest) {
            await this.generateWishlist(apiKey, age, interest);
        }
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new WishlistGenerator();
});