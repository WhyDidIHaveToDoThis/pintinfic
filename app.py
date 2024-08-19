from flask import Flask, render_template, request
import pandas as pd
import json

app = Flask(__name__)

df = pd.read_csv('../Pintinder/library.csv')
df['Status'] = 'Doing'
json_str = df.where(pd.notna(df), None).to_dict(orient='records')

@app.route('/data')
def data():
    # Get pagination parameters
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 5))
    
    # Calculate the start and end indices
    start = (page - 1) * limit
    end = start + limit
    
    # Slice the data
    paginated_data = json_str[start:end]

    return json.dumps(paginated_data)

# Initialize the DataFrame (in-memory)
data_frame = []

@app.route('/save_data', methods=['POST'])
def save_data():
    global data_frame
    try:
        # Get JSON data from request
        data = request.json
        
        # Validate incoming data
        if not all(key in data for key in ['title', 'link', 'status']):
            return json.dumps({'error': 'Missing required fields'}), 400
        
        title = data['title']
        link = data['link']
        status = data['status']

        print(f"{title}, {link}, {status}")
        
        # Append the data to the DataFrame
        new_row = {'title': title, 'link': link, 'status': status}
        data_frame.append(new_row)
        
        # log or print the DataFrame to verify data
        test = pd.DataFrame(data_frame)
        test.to_csv('card-swiper/data/testing.csv', index=False)
        
        return json.dumps({'message': 'Data saved successfully'}), 200
    except Exception as e:
        # Log the exception for debugging purposes
        print(f"Error: {e}")
        return json.dumps({'error': 'Internal server error'}), 500

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8000, debug=True)

