# Linda App 🌍

**Digital Safety for Women & Girls in Kenya**

Linda App is a mobile-friendly Progressive Web Application (PWA) designed to empower women and girls in Kenya with comprehensive digital safety resources, support services, and community connections. Built with accessibility in mind, the app features full bilingual support (English/Kiswahili) and an emoji-based interface optimized for users with varying literacy levels.

---

## 🎯 Mission

To provide accessible, culturally-relevant digital safety education and support resources for women and girls in Kenya, with special focus on vulnerable populations including domestic workers, survivors of online harassment, and those facing gender-based violence.

---

## ✨ Features

### 🧠 AI Chat Assistant
- **Intelligent Q&A**: Get answers to digital safety questions in English or Kiswahili
- **Voice Input**: Speak your questions using voice-to-text technology
- **Chat History**: All conversations are saved for future reference
- **Contextual Help**: AI trained on digital safety topics relevant to Kenyan women

### 📱 Report Abuse
- **Anonymous Reporting**: Submit reports without revealing your identity
- **Multiple Input Methods**: Text descriptions, voice recordings, or photo evidence
- **GPS Location**: Automatically capture incident location (optional)
- **Emergency Calls**: Quick-access floating buttons to dial 999 (Police) or 116 (Childline)
- **Secure Storage**: All reports stored securely in the database

### 🎓 Learning Corner
- **10 Comprehensive Lessons** covering:
  - Protecting personal information
  - Recognizing online scams
  - Safe social media use
  - Cyberbullying and harassment
  - Creating strong passwords
  - Protecting children online
  - Safe online dating
  - Revenge porn and image-based abuse
  - Rights of domestic workers
  - Getting help as a domestic worker
- **Progress Tracking**: Monitor your learning journey
- **Bilingual Content**: Every lesson available in English and Kiswahili
- **Offline Access**: Download lessons for offline reading

### 🔒 Privacy Tips
- **Daily Tips**: Rotating privacy and security advice
- **Push Notifications**: Optional reminders in your preferred language
- **Practical Guidance**: Actionable steps you can take immediately
- **Icon-Based UI**: Easy-to-understand visual indicators

### 🗣 Community Stories
- **16 Inspiring Stories**: Real experiences from women who overcame digital safety challenges
- **Bilingual Stories**: All stories available in English and Kiswahili
- **Emoji Reactions**: Show support with ❤️ 💪 🙏 reactions
- **Anonymous Sharing**: Share your own story to help others
- **Topic Coverage**: Harassment, scams, worker rights, dating safety, revenge porn, and more

### 🧭 Help Centers Map
- **Interactive Map**: Google Maps integration showing NGOs, shelters, and support centers
- **Filter by Type**: Toggle between NGOs, Shelters, and Legal Aid centers
- **Detailed Information**: Contact details, addresses, and services offered
- **Directions**: One-click navigation to any help center
- **Pre-loaded Centers**: FIDA Kenya, Wanawake Kwa Wanawake, Coalition on Violence Against Women, and more

### 🌍 Offline Mode
- **Cached Content**: Access lessons, tips, and help center info without internet
- **Auto-Sync**: Automatically updates when connection is restored
- **Low-Data Friendly**: Optimized for users with limited data plans

### 🌐 Language Toggle
- **Seamless Switching**: Toggle between English and Kiswahili instantly
- **Persistent Preference**: Your language choice is remembered
- **Complete Translation**: All UI elements, content, and messages translated

---

## 🛠 Tech Stack

### Frontend
- **React 19**: Modern UI library with hooks
- **TypeScript**: Type-safe development
- **Tailwind CSS 4**: Utility-first styling with custom theme
- **Wouter**: Lightweight routing
- **tRPC**: End-to-end type-safe API calls
- **shadcn/ui**: Accessible component library
- **Lucide Icons**: Beautiful, consistent iconography

### Backend
- **Node.js 22**: JavaScript runtime
- **Express 4**: Web application framework
- **tRPC 11**: Type-safe API layer
- **Drizzle ORM**: Type-safe database toolkit
- **MySQL/TiDB**: Relational database

### AI & Services
- **Manus LLM Integration**: AI-powered chat assistant
- **Whisper API**: Voice-to-text transcription
- **Google Maps API**: Interactive maps with markers
- **S3 Storage**: File uploads (photos, audio)

### Development Tools
- **Vite**: Fast build tool and dev server
- **pnpm**: Efficient package manager
- **ESLint**: Code linting
- **Prettier**: Code formatting

---

## 📦 Installation

### Prerequisites
- Node.js 22.x or higher
- pnpm (or npm/yarn)
- MySQL database (or TiDB)
- Environment variables (see below)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/TimothyHogi/LindaApp.git
   cd LindaApp
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory with the following variables:
   ```env
   # Database
   DATABASE_URL=mysql://user:password@host:port/database

   # Authentication
   JWT_SECRET=your-jwt-secret-key
   OAUTH_SERVER_URL=https://api.manus.im
   VITE_OAUTH_PORTAL_URL=https://portal.manus.im
   VITE_APP_ID=your-app-id
   OWNER_OPEN_ID=your-owner-openid
   OWNER_NAME=Your Name

   # Manus Built-in APIs
   BUILT_IN_FORGE_API_URL=https://forge.manus.ai
   BUILT_IN_FORGE_API_KEY=your-backend-api-key
   VITE_FRONTEND_FORGE_API_URL=https://forge.manus.ai
   VITE_FRONTEND_FORGE_API_KEY=your-frontend-api-key

   # App Configuration
   VITE_APP_TITLE=Linda App
   VITE_APP_LOGO=/logo.svg
   VITE_ANALYTICS_WEBSITE_ID=your-analytics-id
   VITE_ANALYTICS_ENDPOINT=your-analytics-endpoint
   ```

4. **Set up the database**
   ```bash
   pnpm db:push
   ```

5. **Seed initial data**
   ```bash
   pnpm exec tsx seed-data.mjs
   pnpm exec tsx seed-stories.mjs
   ```

6. **Start the development server**
   ```bash
   pnpm dev
   ```

7. **Access the app**
   
   Open your browser and navigate to `http://localhost:3000`

---

## 🚀 Deployment

### Production Build
```bash
pnpm build
pnpm start
```

### Environment Variables for Production
Ensure all environment variables are properly set in your production environment. Never commit `.env` files to version control.

### Database Migrations
```bash
pnpm db:push
```

---

## 📂 Project Structure

```
linda-app/
├── client/                 # Frontend application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   ├── ui/       # shadcn/ui components
│   │   │   ├── Map.tsx   # Google Maps integration
│   │   │   └── ...
│   │   ├── contexts/      # React contexts
│   │   │   └── LanguageContext.tsx
│   │   ├── pages/         # Page components
│   │   │   ├── Home.tsx
│   │   │   ├── Chat.tsx
│   │   │   ├── Report.tsx
│   │   │   ├── Lessons.tsx
│   │   │   ├── Tips.tsx
│   │   │   ├── Stories.tsx
│   │   │   ├── HelpCenters.tsx
│   │   │   └── Offline.tsx
│   │   ├── lib/           # Utilities
│   │   │   └── trpc.ts   # tRPC client
│   │   ├── App.tsx        # Routes and layout
│   │   ├── main.tsx       # Entry point
│   │   └── index.css      # Global styles
│   └── index.html
├── server/                 # Backend application
│   ├── _core/             # Core framework code
│   │   ├── llm.ts        # LLM integration
│   │   ├── voiceTranscription.ts
│   │   ├── map.ts        # Google Maps proxy
│   │   └── ...
│   ├── db.ts              # Database queries
│   ├── routers.ts         # tRPC routers
│   └── storage.ts         # S3 storage helpers
├── drizzle/               # Database schema
│   └── schema.ts
├── seed-data.mjs          # Seed lessons, tips, help centers
├── seed-stories.mjs       # Seed community stories
├── package.json
└── README.md
```

---

## 🗄 Database Schema

### Users
- Authentication and profile information
- Role-based access control (admin/user)
- Language preferences

### Chat History
- User conversations with AI assistant
- Message content in both languages
- Timestamps

### Reports
- Abuse reports with optional anonymity
- Photo and audio evidence URLs
- GPS coordinates
- Report type and status

### Lessons
- Bilingual educational content
- Optional media (illustrations, audio, video)
- Progress tracking per user

### Privacy Tips
- Daily rotating tips
- Icon-based visual indicators
- Bilingual content

### Community Stories
- User-submitted stories
- Emoji reaction counts
- Language-specific content
- Anonymous posting option

### Help Centers
- NGO and support center information
- GPS coordinates for mapping
- Contact details and services
- Type categorization (NGO, shelter, legal aid)

---

## 🎨 Design System

### Color Palette
- **Primary (Light Blue)**: `oklch(0.75 0.12 220)` - Trust, safety, calm
- **Secondary (Cream)**: `oklch(0.95 0.02 85)` - Warmth, accessibility
- **Accent (Coral Pink)**: `oklch(0.72 0.15 25)` - Empowerment, action

### Typography
- **Font**: Nunito - Friendly, rounded, highly legible
- **Weights**: 400 (regular), 600 (semibold), 700 (bold)

### Accessibility
- Large touch targets (minimum 44x44px)
- High contrast text
- Emoji-based navigation for low literacy
- Screen reader friendly
- Keyboard navigation support

---

## 🌍 Localization

### Supported Languages
- **English (en)**: Primary language
- **Kiswahili (sw)**: Primary language

### Adding Translations
All translatable strings use the `t()` function from `LanguageContext`:

```tsx
const { language, t } = useLanguage();
<h1>{t("Welcome", "Karibu")}</h1>
```

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Contribution Guidelines
- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR
- Keep commits atomic and well-described

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

### Organizations
- **FIDA Kenya** - Legal aid and advocacy for women
- **KUDHEIHA** - Kenya Union of Domestic, Hotels, Educational Institutions, Hospitals and Allied Workers
- **Wanawake Kwa Wanawake** - Women's empowerment organization
- **Coalition on Violence Against Women (COVAW)** - GBV prevention and response

### Technologies
- **Manus Platform** - AI and infrastructure services
- **Google Maps** - Mapping and location services
- **shadcn/ui** - Component library
- **Tailwind CSS** - Styling framework

---

## 📞 Support & Contact

### For Users
- **Emergency**: Call 999 (Police) or 116 (Childline)
- **FIDA Kenya**: Legal aid for women
- **KUDHEIHA**: Domestic worker support

### For Developers
- **Issues**: [GitHub Issues](https://github.com/TimothyHogi/LindaApp/issues)
- **Discussions**: [GitHub Discussions](https://github.com/TimothyHogi/LindaApp/discussions)

---

## 🔒 Security & Privacy

### Data Protection
- All user data encrypted in transit (HTTPS)
- Anonymous reporting options available
- No personal data shared without consent
- Secure file storage on S3

### Privacy Policy
- Chat history stored per user
- Reports can be submitted anonymously
- Location data only captured with user permission
- No tracking or analytics without consent

---

## 🚧 Roadmap

### Planned Features
- [ ] Audio narration for all lessons
- [ ] Downloadable PDF resource library
- [ ] Success stories moderation dashboard
- [ ] Story categories and filtering
- [ ] Voice recording for story submissions
- [ ] SMS/WhatsApp integration for tips
- [ ] Offline report drafts with auto-sync
- [ ] Achievement badges for lesson completion
- [ ] Multi-language support (add more Kenyan languages)

---

## 📊 Impact

Linda App aims to:
- **Educate** 10,000+ women and girls on digital safety
- **Connect** survivors with support services
- **Empower** domestic workers to know their rights
- **Prevent** online harassment and scams
- **Support** victims of gender-based violence

---

## 💡 About the Name

**Linda** means "protect" or "guard" in Kiswahili, reflecting the app's mission to protect and empower women and girls in the digital space.

---

**Built with ❤️ for the women and girls of Kenya**

*Empowering digital safety, one story at a time.*
