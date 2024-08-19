from flask import Flask, jsonify, render_template
import pandas as pd

app = Flask(__name__)

df = pd.read_csv('../Pintinder/library.csv')

df['Status'] = 'Doing'

@app.route('/data')
def data():
    return jsonify(df.to_dict(orient='records'))

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)

