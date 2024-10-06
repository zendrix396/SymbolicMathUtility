from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import sympy as sp
import os
app = Flask(__name__, static_folder='static')
CORS(app)
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')
@app.route('/compute', methods=['POST'])
def compute():
    data = request.get_json()
    expr_input = data.get('expression', '').replace('^', '**').strip()
    operation_input = data.get('operation', '').lower().strip()
    
    try:
        expr = sp.sympify(expr_input)
        symbols = expr.free_symbols
    except sp.SympifyError:
        return jsonify({'error': 'Invalid function input.'}), 400

    if not symbols:
        symbols = {sp.symbols('x')}
    default_var = sp.symbols('x')

    if operation_input.startswith('parder'):
        parts = operation_input.split()
        if len(parts) != 2:
            return jsonify({'error': "Invalid partial derivative command. Use 'parder <variable>'."}), 400
        var_str = parts[1]
        var = sp.symbols(var_str)
        if var not in symbols:
            return jsonify({'error': f"Variable '{var}' not found in the expression."}), 400
        result = sp.diff(expr, var)
        operation_name = f"Partial Derivative with respect to {var}"
    elif operation_input == 'der':
        result = sp.diff(expr, default_var)
        operation_name = "Derivative"
    elif operation_input == 'int':
        result = sp.integrate(expr, default_var)
        operation_name = "Integral"
    else:
        return jsonify({'error': "Invalid operation. Please enter 'der' for derivative, 'int' for integral, or 'parder <variable>' for partial derivative."}), 400

    simplified_result = sp.simplify(result)
    result_latex = sp.latex(simplified_result)
    operation_latex = sp.latex(operation_name)
    expr_latex = sp.latex(sp.sympify(expr_input))

    response = {
        'operation': operation_name,
        'expression': expr_input.replace('**', '^'),
        'result': str(simplified_result),
        'operation_latex': operation_latex,
        'expression_latex': expr_latex,
        'result_latex': result_latex
    }
    return jsonify(response), 200

if __name__ == "__main__":
    app.run()
