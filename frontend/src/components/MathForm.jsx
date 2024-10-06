import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSun, FaMoon } from 'react-icons/fa';

function MathForm() {
    const [expression, setExpression] = useState('');
    const [operation, setOperation] = useState('der');
    const [partialVar, setPartialVar] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        setIsDarkMode(savedTheme === 'dark');
    }, []);

    useEffect(() => {
        document.body.style.transition = 'background-color 0.3s'; // Smooth transition
        document.body.style.backgroundColor = isDarkMode ? '#1a202c' : '#f7fafc'; // Dark or light background
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    const handleOperationChange = (e) => {
        setOperation(e.target.value);
        if (e.target.value !== 'parder') {
            setPartialVar('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setResult(null);

        let opInput = operation;
        if (operation === 'parder') {
            if (!partialVar.trim()) {
                setError("Please specify the variable for partial derivative.");
                return;
            }
            opInput = `parder ${partialVar.trim()}`;
        }

        try {
            const response = await axios.post('http://localhost:5000/compute', {
                expression,
                operation: opInput
            });
            setResult(response.data);
        } catch (err) {
            if (err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error);
            } else {
                setError("An unexpected error occurred.");
            }
        }
    };
    return (
        <div className={`min-h-screen w-full flex items-center justify-center p-4 transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`p-8 rounded-lg shadow-lg w-full max-w-xl ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
            >
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Symbolic Math Utility</h1>
                    <button
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className={`p-2 ml-4 rounded-full ${isDarkMode ? 'bg-yellow-400 text-gray-900' : 'bg-gray-800 text-yellow-400'}`}
                    >
                        {isDarkMode ? <FaSun /> : <FaMoon />}
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1">Function:</label>
                        <input
                            type="text"
                            className={`w-full p-2 border rounded ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                            value={expression}
                            onChange={(e) => setExpression(e.target.value)}
                            placeholder="e.g., x^2 + y^3"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1">Operation:</label>
                        <select
                            className={`w-full p-2 border rounded ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                            value={operation}
                            onChange={handleOperationChange}
                        >
                            <option value="der">Derivative</option>
                            <option value="int">Integral</option>
                            <option value="parder">Partial Derivative</option>
                        </select>
                    </div>
                    <AnimatePresence>
                        {operation === 'parder' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <label className="block mb-1">Variable:</label>
                                <input
                                    type="text"
                                    className={`w-full p-2 border rounded ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                                    value={partialVar}
                                    onChange={(e) => setPartialVar(e.target.value)}
                                    placeholder="e.g., x or y"
                                    required
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <button
                        type="submit"
                        className={`w-full p-2 rounded transition-colors duration-300 ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
                    >
                        Compute
                    </button>
                </form>
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="mt-4 text-red-500"
                        >
                            {error}
                        </motion.div>
                    )}
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.3 }}
                            className={`mt-4 p-4 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-green-100'}`}
                        >
                            <h2 className="text-xl font-semibold mb-2">Result:</h2>
                            <p><strong>Operation:</strong> {result.operation}</p>
                            <p><strong>Expression:</strong> <InlineMath math={result.expression} /></p>
                            <div className="mt-2">
                                <strong>Result:</strong>
                                <BlockMath math={result.result_latex} />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}

export default MathForm;