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
import sqlite3 as sql
from flask import Flask
from flask import request
from flask import send_file,render_template

app = Flask(__name__)

@app.route('/')
@app.route('/index', methods = ['GET','POST'])
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

    if request.method == 'POST':
        # On va chercher les données du formulaire qui a été envoyé par la requête POST
        markerTitle = request.form.get("markerTitle")
        markerDescription = request.form.get("markerDescription")
        markerLongitude = request.form.get("markerLongitude")
        markerLatitude = request.form.get("markerLatitude")
        markerIcon = request.form.get("markerIcon")

        # On insère les données dans la base de donnée par une requête SQL
        cur.execute(
        '''INSERT INTO "markers" (
            "description",
            "icon",
            "longitude",
            "latitude",
            "zone"
        )
        VALUES("<strong>
        ''' + markerTitle + '</strong><p>' + markerDescription + '</p>", "' + markerIcon + '","' + markerLongitude + '","' + markerLatitude + '", 1)')

        # On confirme la modification de la base de donnée

        # /!\ Si on enlève cette étape, les données seront quand même affichées sur la carte pour cet affichage web uniquement
        # Les modifications seront annulées lorsqu'on se déconnecte de la base de données seulement (c'est à dire à la fin de cette fonction)
        # Enlever la ligne suivante peut donc être un bon moyen de faire des tests d'affichage sans modifier la base de données
        con.commit()


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

    # On lui donne les icones à charger en plus dans mapbox (les images que l'on veut pouvoir utiliser ensuite pour l'affichage)
    image_names = os.listdir(dir_path + '/icon_folder/')
    image_names = ['/icons/' + image_name for image_name in image_names]

    return render_template('index.html',data = data,icons = image_names)



@app.route('/icons/<icon>')
def icon_display(icon):
    # dir_path est le chemin qui mène au dossier parent, quel que soit l'environnement d'exécution
    dir_path = os.path.dirname(os.path.realpath(__file__))
     
    if os.path.exists(dir_path + '/icon_folder/' + icon):
        return send_file(dir_path + '/icon_folder/' + icon)



@app.route('/js/<script>')
def send_script(script):
    dir_path = os.path.dirname(os.path.realpath(__file__))
    return send_file(dir_path + '/static/js/' + script)

@app.route('/css/<file>')
def send_css(file):
    dir_path = os.path.dirname(os.path.realpath(__file__))
    return send_file(dir_path + '/static/css/' + file)

@app.route('/favicon.ico')
def send_icon():
    dir_path = os.path.dirname(os.path.realpath(__file__))
    return send_file(dir_path + '/marx.ico')

@app.route('/test_page')
def test_function():
    return render_template('test_html.html')

if __name__ == "__main__":
    port = 5000
    app.run(debug=True, host='127.0.0.1', port=port)
