# 💧 WaterSpot - Advanced Water Quality Analysis Platform

A comprehensive web application for predicting and analyzing water quality by area using scientific Water Quality Index (WQI) calculations. Built with Next.js 15, TypeScript, and modern web technologies.

## 🌟 Features

### 🎯 Core Functionality
- **Single Prediction**: Real-time WQI calculation from water parameters with confidence scores
- **Bulk Upload**: Process 50k+ rows from CSV/Excel files with streaming validation
- **Interactive Maps**: Geographic visualization with heatmaps and filtering
- **Comprehensive Dashboard**: KPIs, trends, and analytics
- **Smart Recommendations**: Actionable tips when water quality is poor

### 📊 Advanced Analytics
- **WQI Calculation**: Scientific algorithm using BIS/WHO standards
- **Parameter Contributions**: Identify which parameters affect water quality most
- **Trend Analysis**: Track water quality changes over time
- **Correlation Studies**: Understand relationships between parameters
- **Export Capabilities**: Download annotated CSVs and chart PNGs

### 🎨 User Experience
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Real-time Validation**: Instant feedback on data input
- **Progress Tracking**: Visual progress for bulk operations
- **Interactive Charts**: Beautiful data visualizations with Recharts
- **Dark Mode Support**: Built-in theme switching

## 🛠️ Technology Stack

### Core Framework
- **⚡ Next.js 15** - React framework with App Router
- **📘 TypeScript 5** - Type-safe development
- **🎨 Tailwind CSS 4** - Utility-first styling
- **🧩 shadcn/ui** - High-quality component library

### Database & Backend
- **🗄️ Prisma ORM** - Type-safe database operations
- **💾 SQLite** - Local development database
- **🔐 NextAuth.js** - Authentication system
- **📊 Zod** - Schema validation

### Data Processing
- **📈 Recharts** - Data visualization
- **📋 PapaParse** - CSV parsing
- **📊 XLSX** - Excel file handling
- **🗺️ React-Leaflet** - Interactive maps

### UI/UX
- **🎯 Lucide React** - Beautiful icons
- **🌊 Framer Motion** - Smooth animations
- **📱 Responsive Design** - Mobile-optimized
- **🎨 Dark Mode** - Theme switching

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up database
npm run db:push

# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   └── predict/       # WQI calculation API
│   ├── prediction/        # Single prediction page
│   ├── uploads/           # Bulk upload interface
│   ├── analysis/          # Map and analytics
│   ├── dashboard/         # Admin dashboard
│   └── docs/              # Documentation
├── components/            # React components
│   └── ui/               # shadcn/ui components
├── lib/                  # Utility functions
│   ├── water-quality.ts  # WQI calculation logic
│   └── db.ts            # Database client
└── hooks/               # Custom React hooks
```

## 🧮 WQI Calculation

WaterSpot uses a scientifically-backed WQI calculation:

```
WQI = Σ (Wi × Si) / Σ Wi

Where:
- Wi = Weight of i-th parameter
- Si = Sub-index of i-th parameter (0-100)
```

### Parameters & Weights:
- **pH**: 15% (Ideal: 7.0, Range: 6.5-8.5)
- **Hardness**: 10% (Max: 300 mg/L)
- **TDS**: 10% (Max: 500 mg/L)
- **Turbidity**: 15% (Max: 5 NTU)
- **Alkalinity**: 8% (Max: 200 mg/L)
- **Nitrate**: 15% (Max: 45 mg/L)
- **Fluoride**: 12% (Max: 1.5 mg/L)
- **Chloride**: 8% (Max: 250 mg/L)
- **Conductivity**: 7% (Max: 1500 µS/cm)

### Classification:
- **Good**: WQI ≥ 80
- **Moderate**: 60 ≤ WQI < 80
- **Poor**: WQI < 60

## 📊 API Reference

### POST /api/predict
Calculate WQI from water parameters.

```bash
curl -X POST /api/predict \
  -H "Content-Type: application/json" \
  -d '{
    "ph": 7.2,
    "hardness": 150,
    "tds": 200,
    "turbidity": 2.5,
    "alkalinity": 100,
    "nitrate": 15,
    "fluoride": 0.8,
    "chloride": 25,
    "conductivity": 500,
    "temperature": 22
  }'
```

**Response:**
```json
{
  "wqi": 75.5,
  "label": "Moderate",
  "confidence": 90,
  "warnings": ["TDS exceeds safe limit"],
  "parameterContributions": [...],
  "tips": [...]
}
```

## 📋 Bulk Upload Format

Required columns for CSV/Excel files:
```
area, latitude, longitude, date, ph, hardness, tds, turbidity, alkalinity, nitrate, fluoride, chloride, conductivity, temperature
```

**Example:**
```csv
area, latitude, longitude, date, ph, hardness, tds, turbidity, alkalinity, nitrate, fluoride, chloride, conductivity, temperature
Downtown, 40.7128, -74.0060, 2024-01-15, 7.2, 150, 200, 2.5, 100, 15, 0.8, 25, 500, 22
```

## 🎯 Key Features

### 🔬 Scientific Accuracy
- BIS/WHO standard compliance
- Weighted parameter analysis
- Confidence scoring
- Parameter contribution analysis

### 📈 Data Visualization
- Interactive heatmaps
- Time-series trends
- Correlation matrices
- Distribution charts

### ⚡ Performance
- Streaming file processing
- Chunked database writes
- Real-time validation
- Optimized queries

### 🔒 Security
- Input validation
- SQL injection prevention
- File upload security
- Rate limiting

## 🌍 Environment Variables

Create a `.env` file with:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
```

## 📚 Documentation

- **[WQI Formula](/docs#wqi-formula)** - Detailed calculation methodology
- **[API Reference](/docs#api-reference)** - Complete API documentation
- **[Parameter Standards](/docs#standards)** - BIS/WHO parameter limits
- **[Code Examples](/docs#examples)** - Integration examples

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- BIS (Bureau of Indian Standards) for water quality guidelines
- WHO (World Health Organization) for international standards
- The open-source community for the amazing tools and libraries

---

Built with 💧 for better water quality monitoring and analysis.
