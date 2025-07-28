# Veronica's Wish List Generator 🎁✨

A beautiful, interactive web application that generates personalized wishlists based on age and interests using **GitHub Models GPT-4 Mini**.

## Features

- **Modern, Responsive Design**: Beautiful gradient backgrounds, smooth animations, and mobile-friendly interface
- **AI-Powered Recommendations**: Uses GitHub Models GPT-4 Mini to generate 10 custom wishlist items based on user's age and interests
- **Interactive UI**: Smooth transitions, loading animations, and hover effects
- **Smart Personalization**: Tailors suggestions based on specific interests like reading, music, cooking, gaming, art, and more
- **Age-Appropriate Items**: Adjusts recommendations based on different age groups
- **Secure API Integration**: Uses your GitHub Models API key for personalized AI generation

## How It Works

1. **Enter API Key**: Provide your GitHub Models API key for AI generation
2. **Enter Your Age**: Input your age to get age-appropriate recommendations
3. **Describe Your Interests**: Tell us about your hobbies, passions, and things you love
4. **Generate**: Click the magic button to let GPT-4 Mini create your personalized wishlist
5. **Enjoy**: Browse through 10 AI-curated items perfect for you

## Getting Started

### Prerequisites

- A GitHub Models API key (free tier available)
- Modern web browser with JavaScript enabled

### Getting Your API Key

1. Visit [GitHub Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens)
2. Create a new token with appropriate permissions for GitHub Models
3. Copy your token and paste it into the webapp

### Usage

1. Visit the live webapp: **https://johan-j.github.io/veronicas-wish-list/**
2. Enter your GitHub Models API key
3. Fill in your age and interests
4. Click "Generate My Wishlist"
5. Get 10 personalized AI-generated recommendations!

## Interest Categories Supported

The AI can generate recommendations for various interests including:

- 📚 **Reading & Books**: Book subscriptions, reading accessories
- 🎵 **Music**: Instruments, streaming services, audio equipment
- 👩‍🍳 **Cooking & Baking**: Kitchen tools, recipe books, ingredients
- ✈️ **Travel & Adventure**: Travel accessories, journals, experiences
- 🎮 **Gaming**: Gaming accessories, subscriptions, equipment
- 🎨 **Art & Creativity**: Art supplies, tools, inspiration
- 🧘‍♀️ **Fitness & Wellness**: Exercise equipment, wellness products
- 💻 **Technology**: Tech gadgets, accessories, tools
- And many more!

## Age-Based Customization

The AI considers age when generating recommendations:

- **Under 18**: Study supplies, educational items, age-appropriate entertainment
- **18-30**: Lifestyle products, career-oriented items, trendy gadgets
- **30+**: Luxury items, wellness products, home improvement, premium experiences

## Technical Details

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **AI Integration**: GitHub Models API with GPT-4 Mini
- **Styling**: Modern CSS with gradients, animations, and responsive design
- **Icons**: Font Awesome 6
- **Fonts**: Google Fonts (Poppins)

## API Integration

The webapp uses the GitHub Models API with the following configuration:

- **Model**: `gpt-4o-mini`
- **Endpoint**: `https://models.inference.ai.azure.com/chat/completions`
- **Temperature**: 0.8 (for creative variety)
- **Max Tokens**: 2000

## Error Handling

The app includes comprehensive error handling for:

- Invalid API keys
- Rate limiting
- Network errors
- Malformed responses
- Fallback generation when API is unavailable

## Security & Privacy

- API keys are stored only in browser memory (not persisted)
- No user data is stored on servers
- All API calls are made directly from your browser
- Uses HTTPS for all communications

## Sample AI-Generated Items

The AI generates diverse items like:
- Premium Notebook Set for journaling
- Bluetooth Wireless Earbuds for music lovers
- Professional Chef's Knife for cooking enthusiasts
- Art Supply Set for creative minds
- Yoga Mat & Accessories for fitness enthusiasts
- And 5 more personalized items based on your specific interests!

## Local Development

1. Clone the repository
2. Open `index.html` in your browser
3. No build process required - it's pure HTML/CSS/JavaScript!

## Future Enhancements

- User accounts and wishlist saving
- Social sharing features
- Price estimation and shopping links
- Multiple wishlist themes
- Export to PDF functionality
- Integration with shopping platforms

---

**Live Demo**: https://johan-j.github.io/veronicas-wish-list/

Made with ❤️ for Veronica • Powered by GitHub Models GPT-4 Mini