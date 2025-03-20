# Symbolic Math Utility

Symbolic Math Utility is a web application that allows users to perform symbolic mathematical operations such as differentiation, integration, and partial differentiation. The application features a modern UI with both dark and light modes and provides real-time results with smooth transitions.

## Features
- **Symbolic Derivatives:** Calculate the derivative of a mathematical expression.
- **Integrals:** Compute the integral of a given function.
- **Partial Derivatives:** Calculate partial derivatives with respect to a specified variable.
- **Dark/Light Mode:** Toggle between dark and light themes.
- **Smooth Animations:** UI transitions are powered by Framer Motion.
- **Error Handling:** Displays meaningful error messages when computations fail.

## Tech Stack
### Frontend
- React.js
- Tailwind CSS
- Framer Motion
- KaTeX for mathematical notation
- Axios for API communication

### Backend
- Flask (Python)
- SymPy for symbolic math calculations

## Installation

### Prerequisites
- Node.js and npm
- Python 3.9+
- pip

### Clone the Repository
```bash
git clone https://github.com/YusiferZendric/SymbolicMathUtility.git
cd SymbolicMathUtility
```

### Frontend Setup
```bash
cd frontend
npm install
```

### Backend Setup
```bash
cd backend
python app.py
```

### Running the Frontend
```bash
cd frontend
npm start
```

### Access the Application
Visit http://localhost:3000 in your browser.

### Usage
- Enter the mathematical expression in the input field.  
- Select the operation (Derivative, Integral, or Partial Derivative).  
- If selecting a partial derivative, specify the variable.  
- Click **"Compute"** to get the result.  
- The result will be displayed along with the formatted mathematical notation.  

### Contributing
Feel free to open issues or submit PRs to improve the functionality or UI.
