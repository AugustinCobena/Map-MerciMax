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
import os
import json
import sqlite3 as sql
from flask import Flask
from flask import render_template
from flask import send_file

app = Flask(__name__)

@app.route('/')
@app.route('/index')
def index():

    # On définit le path pour qu'il mène à la db située dans le même dossier que ce fichier quel que soit l'environnement d'exécution
    dir_path = os.path.dirname(os.path.realpath(__file__))
    con = sql.connect(dir_path + '/mercimax.db')

    # On change le fonctionnement du curseur afin qu'il renvoie les résultats de requêtes SQL sous forme de liste de dictionnaires
    # (c'est la liste des éléments renvoyés par la requête, chaque élément sous forme de dictionnaire, la clé est le nom de la colonne)
    #------------------
    def dict_factory(cursor, row):
        d = {}
        for idx, col in enumerate(cursor.description):
            d[col[0]] = row[idx]
        return d
    con.row_factory = dict_factory
    #-------------------
    cur = con.cursor()

    cur.execute("select * from markers;")

    markers = cur.fetchall()

    # On crée une nouvelle variable avec les informations correspondantes à la syntaxe attendue par la fonction mapbox
    features = []

    # Marker est donc un dictionnaire avec les éléments suivants:
    # - "description" : la description du point, en html, qui s'affiche quand on clique dessus
    # - "icon" : un string qui correspond à l'icone à utiliser
    # - "longitude", "latitude" : les coordonnées du point
    
    for marker in markers:

        feature = {}
        feature["type"] = "Feature"

        feature["properties"] = {}
        feature["properties"]["description"] = marker["description"]
        feature["properties"]["icon"] = marker["icon"]

        feature["geometry"] = {"type":"Point"}
        feature["geometry"]["coordinates"] = [marker["longitude"],marker["latitude"]]

        features.append(feature)
    data = {"type":"FeatureCollection","features":features}

    # On lui donne les icones à charger en plus dans mapbox
    image_names = os.listdir(dir_path + '/icon_folder/')
    image_names = ['/icons/' + image_name for image_name in image_names]

    return render_template('index.html',data = data,icons = image_names)


@app.route('/icons/<icon>')
def icon_display(icon):
    # dir_path est le chemin qui mène au dossier parent, quel que soit l'environnement d'exécution
    dir_path = os.path.dirname(os.path.realpath(__file__))
     
    if os.path.exists(dir_path + '/icon_folder/' + icon):
        return send_file(dir_path + '/icon_folder/' + icon)




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
