# Imager.AI 🎨

An intelligent text-to-image generation tool powered by Google's Gemini API with advanced self-evaluation capabilities. Imager.AI not only creates stunning images from text prompts but also automatically evaluates and iteratively improves them for better quality and prompt alignment.

## ✨ Features

- **Text-to-Image Generation**: Transform your text descriptions into high-quality images using Gemini API
- **Self-Evaluation Loop**: Automatically analyzes generated images and makes improvements
- **Iterative Refinement**: Continuously enhances images based on evaluation feedback
- **Real-time Communication**: Live updates via WebSocket connection during generation process
- **Responsive Design**: Clean, modern interface built with Tailwind CSS
- **Local Installation**: Run entirely on your own infrastructure

## 🛠️ Technologies Used

### Frontend

- **Next.js** - React framework for production-ready applications
- **React** - Component-based UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Socket.IO Client** - Real-time bidirectional communication

### Backend

- **Express.js** - Fast, minimalist web framework for Node.js
- **Socket.IO** - Real-time WebSocket communication
- **LlamaIndex** - Orchestration framework for AI workflows
- **Google Gemini API** - AI-powered image generation

## 📋 Prerequisites

- **Node.js** (version 16 or higher)
- **npm** or **yarn** package manager
- **Google Gemini API Key** ([Get it here](https://makersuite.google.com/app/apikey))

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/simrat-webdev/Imager.AI.git
cd imager-ai
```

### 2. Install Dependencies

**Install client dependencies:**

```bash
cd client
npm install
```

**Install server dependencies:**

```bash
cd ../server
npm install
```

### 3. Environment Configuration

**Client Environment** (create `client/.env.local`):

```env
NEXT_PUBLIC_SERVER_URL=http://localhost:3001
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

**Server Environment** (create `server/.env`):

```env
PORT=3001
GEMINI_API_KEY=your_gemini_api_key_here
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

### 4. Start the Application

**Start the backend server:**

```bash
cd server
npx tsx --env-file=.env server.ts
```

**Start the frontend (in a new terminal):**

```bash
cd client
npm run dev
```

The application will be available at:

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001

## 🎯 Usage

1. **Enter Your Prompt**: Type a detailed description of the image you want to generate
2. **Generate Image**: Click the generate button to start the AI image creation process
3. **Real-time Updates**: Watch as the system provides live updates via WebSocket
4. **Automatic Evaluation**: The system evaluates the generated image quality and alignment
5. **Iterative Improvement**: If needed, the system automatically refines the image for better results
6. **Download Result**: Save your final enhanced image

### Example Prompts

- "A serene mountain landscape at sunset with purple clouds"
- "A futuristic cyberpunk city with neon lights and flying cars"
- "A cute cartoon robot playing chess in a cozy library"

## 🔄 How the Self-Evaluation Works

1. **Initial Generation**: Gemini API creates an image based on your text prompt
2. **Quality Assessment**: The system analyzes the generated image for:
   - Prompt adherence/faithfulness
   - Visual quality
3. **Feedback Loop**: If improvements are needed, the system:
   - Identifies specific areas for enhancement
   - Generates refined prompts
   - Creates improved versions
4. **Final Selection**: Delivers the best iteration based on evaluation metrics

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style and conventions
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation if needed

## 🐛 Troubleshooting

### Common Issues

**Invalid API Key Error:**

- Verify your Gemini API key is correct
- Check if the API key has proper permissions
- Ensure the key is properly set in the `.env` file

**Connection Issues:**

- Make sure both client and server are running
- Check if ports 3000 and 3001 are available
- Verify firewall settings

**Image Generation Fails:**

- Check your internet connection
- Verify API quota limits
- Review prompt formatting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Gemini API for powerful image generation capabilities
- LlamaIndex team for excellent orchestration tools
- Open source community for the amazing libraries used

## 📞 Support

If you encounter any issues or have questions:

- Open an issue on GitHub
- Check the troubleshooting section
- Review the API documentation

---

**Made with ❤️ using cutting-edge AI technology**
