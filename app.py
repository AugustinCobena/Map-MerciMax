# -*- coding: utf-8 -*-
"""
Created on Fri Mar 18 13:26:53 2022
1) installer falsk : 
pip install flask
2) to lauch server :
flask run
    
3) then put in your navigator
http://127.0.0.1:5000/
    
@author: CHRISTIAN
"""

import json

from flask import Flask
from flask import render_template

app = Flask(__name__)

@app.route('/')
@app.route('/index')
def index():
    name = 'Max'
    return render_template('index.html', title='Welcome', username=name)

@app.route('/planb')
def planb():
    name = 'Minimum'
    return render_template('index.html', title='Welcome', username=name)

@app.route('/api')
def api():
    return json.dumps({'name': 'alice',
                       'email': 'alice@outlook.com'})
    
    
if __name__ == "__main__":
    port = 5000
    app.run(debug=True, host='127.0.0.1', port=port)
