from flask import Flask, request, jsonify,send_from_directory
from flask_cors import CORS
import functions as fn

import json
import os

ip:str = '127.0.0.1'
port:int = 5000

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

# check if email has landlord permission
@app.route('/isLandLord/<email>')
def respond_to_landlordQuery(email):
    # checks if the email is from a landlord
    accounts = fn.loadAccounts()

    if email not in accounts:
        return json.dumps({"isLandLord": False})

    personInfo = accounts[email]
    return json.dumps({"isLandLord": personInfo["landlord_permission"]})

# save new add
@app.route('/form', methods=['POST'])
def processNewAd():
    data = request.form

    print("==== Incoming form data ====")
    for key in request.form:
        print(f"{key}: {request.form[key]}")
    print("==== Incoming files ====")
    for file_key in request.files:
        print(f"{file_key}: {request.files[file_key].filename}")

    if data is None:
        return jsonify({"error": "Invalid form data"}), 400
    
    required_fields = [
        'email', 'description', 'date', 'name', 'price', 'availableDate',
        'gender', 'quantity', 'district', 'city', 'street', 'minAge', 'maxAge',
        'bathShare', 'expenseIncluded', 'maritalStatus'
    ]

    email = data.get('email')
    description = data.get('description')
    date = data.get('date') or str(datetime.datetime.now())
    image = request.files.get('image')
    name = data.get('name')
    price = data.get('price')
    available_date = data.get('availableDate')
    gender = data.get('gender')
    quantity = data.get('quantity')
    district = data.get('district')
    city = data.get('city')
    street = data.get('street')
    min_age = data.get('minAge')
    max_age = data.get('maxAge')
    bath_share = data.get('bathShare')
    expense_included = data.get('expenseIncluded')
    marital_status = data.get('maritalStatus')
    tags = data.getlist('tags[]')

    for field in required_fields:
        if not data.get(field):
            return jsonify({"error": f"Missing or empty field: {field}"}), 400

    if image is None:
        return jsonify({"error": "Image is required"}), 400

    accounts = fn.loadAccounts()



    import hashlib
    hash_input = f"{description}{date}".encode() + image.read()
    image_hash = hashlib.sha256(hash_input).hexdigest()
    image.seek(0)

    ads = fn.loadAds()
    ads[image_hash] = {
        "email": email,
        "description": description,
        "date": date,
        "image_path": f'images/{image_hash}.png',
        "name": name,
        "price": price,
        "available_date": available_date,
        "gender": gender,
        "quantity": quantity,
        "district": district,
        "city": city,
        "street": street,
        "min_age": min_age,
        "max_age": max_age,
        "bath_share": bath_share,
        "expense_included": expense_included,
        "marital_status": marital_status,
        "tags": tags
    }

    ll_ads = fn.loadll_ads()
    if email in ll_ads:
        ll_ads[email].append(image_hash)
    else:
        ll_ads[email] = [image_hash]

    fn.savell_ads(ll_ads)
    fn.saveAds(ads)
    image.save(f'images/{image_hash}.png')

    return jsonify({"response": "OK"}), 200


# get all ads
@app.route('/ads/')
def getAds():
    ads = fn.loadAds()
    # Assuming ads is a dictionary with ad details including image_path
    ads_with_images = []
    for ad_id, ad_info in ads.items():
        ad_info['image_url'] = request.host_url + ad_info['image_path']
        ads_with_images.append(ad_info)
    return jsonify(ads_with_images), 200

# get an specific ad info
@app.route('/ads/<adhc>')
def getad(adhc):
    ads = fn.loadAds()

    if not adhc in ads:
        return jsonify({"error": "add not found"}), 400

    ad = ads[adhc].copy()
    ad['image_url'] = request.host_url + ad['image_path']
    return jsonify(ad),200

# get all ads from landlord
@app.route('/landlord/ads/<email>')
def getlandlordAds(email):
    ll_ads = fn.loadll_ads()
    fromLandLord = ll_ads.get(email,None)
    if fromLandLord is None:
        return jsonify({"response": {}}), 200
    return jsonify({"response": fromLandLord}), 200

# save signin info
@app.route('/signin/<email>:<psk>:<isLandlord>')
def saveSignin(email,psk,isLandlord):

    accounts = fn.loadAccounts()
    if email in accounts:
        # email already in use
        return json.dumps({"response":"NOK"})

    # Add new account
    accounts[email] = {
        "psk": psk,
        "landlord_permission": isLandlord.lower() == 'true'
    }

    # Save updated info back to info.json
    fn.saveAccounts(accounts)

    return json.dumps({"response":"OK"})

# return stored image
@app.route('/images/<filename>')
def serve_image(filename):
    return send_from_directory('images', filename)

if __name__ == '__main__':
    app.run(host=ip, port=port)
