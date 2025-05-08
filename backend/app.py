from flask import Flask, request, jsonify,send_from_directory
from flask_cors import CORS
import functions as fn

import json

ip:str = '127.0.0.1'
port:int = 5000

app = Flask(__name__)
CORS(app,supports_credentials=True)

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
    try:
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
            'email', 'description', 'date', 'name', 'price', 'available_date',
            'gender', 'quantity', 'district', 'city', 'street', 'min_age', 'max_age',
            'bath_share', 'expense_included', 'marital_status'
        ]

        email = data.get('email')
        description = data.get('description')
        date = data.get('date') or str(datetime.datetime.now())
        image = request.files.get('image')
        name = data.get('name')
        price = data.get('price')
        available_date = data.get('available_date')
        gender = data.get('gender')
        quantity = data.get('quantity')
        district = data.get('district')
        city = data.get('city')
        street = data.get('street')
        min_age = data.get('min_age')
        max_age = data.get('max_age')
        bath_share = data.get('bath_share')
        expense_included = data.get('expense_included')
        marital_status = data.get('marital_status')
        tags = data.getlist('tags[]')
        isNew = data.getlist('isNew[]')
        print("==== ISNEW ====")

        print("isNew:", isNew)


        for field in required_fields:
            if not data.get(field):
                return jsonify({"error": f"Missing or empty field: {field}"}), 400

        if image is None:
            return jsonify({"error": "Image is required"}), 400

        accounts = fn.loadAccounts()


        if (str(isNew[0])=="true"):
            import hashlib
            hash_input = f"{description}{date}".encode() + image.read()
            image_hash = hashlib.sha256(hash_input).hexdigest()
            image.seek(0)

        else:
            image_hash = isNew[1]

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
            "tags": tags,
            "isNew": isNew
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
    except Exception as e:
        print("ERROR:", str(e))
        return jsonify({"error": str(e)}), 400



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

# get all ads
@app.route('/disabled_ads/')
def get_disabled_Ads():
    dis_ads = fn.loadDisabled_ads()
    # Assuming dis_ads is a dictionary with ad details including image_path
    dis_ads_with_images = []
    for ad_id, ad_info in dis_ads.items():
        ad_info['image_url'] = request.host_url + ad_info['image_path']
        dis_ads_with_images.append(ad_info)
    return jsonify(dis_ads_with_images), 200

# get an specific ad info
@app.route('/ads/<adhc>')
def getad(adhc):
    ads = fn.loadAds()

    if not adhc in ads:
        return jsonify({"error": "add not found"}), 400

    ad = ads[adhc].copy()
    ad['image_url'] = request.host_url + ad['image_path']
    return jsonify(ad),200

# get an specific ad info
@app.route('/ads/<adhc>')
def getDisabledad(adhc):
    dis_ads = fn.loadDisabled_ads()

    if not adhc in dis_ads:
        return jsonify({"error": "add not found"}), 400

    ad = dis_ads[adhc].copy()
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

@app.route('/delete_ad/<adhc>', methods=["DELETE", "OPTIONS"])
def delete_ad(adhc):
    ads = fn.loadAds()
    ll_ads = fn.loadll_ads()

    # Remove the ad from the dictionary
    if (adhc in ads):
        del ads[adhc]
        ll_ads["supreme_landlord@gmail.com"].remove(adhc)

    # Save the updated ads back to storage
    fn.saveAds(ads)
    fn.savell_ads(ll_ads)

    # Return a successful response indicating deletion
    return jsonify({"message": "Ad deleted successfully"}), 200


# disable ad
@app.route('/disable_ad/<adhc>', methods=['POST'])
def disableAd(adhc):
    try:
        #Fetching the ad
        ads = fn.loadAds()
        target_ad = ads[adhc].copy()

        #Saving the ad to new location
        dis_ads = fn.loadDisabled_ads()

        dis_ads[adhc] = target_ad
        fn.saveDisabled_ads(dis_ads)

        # Remove the ad from the original dictionary
        if (adhc in ads):
            del ads[adhc]

        fn.saveAds(ads)

        return jsonify({"response": "OK"}), 200
    except Exception as e:
        print("ERROR:", str(e))
        return jsonify({"error": str(e)}), 400


# enable ad
@app.route('/enable_ad/<adhc>', methods=['POST'])
def enableAd(adhc):
    try:
        #Fetching the ad
        dis_ads = fn.loadDisabled_ads()
        target_ad = dis_ads[adhc].copy()

        #Saving the ad to new location
        ads = fn.loadAds()

        ads[adhc] = target_ad
        fn.saveAds(ads)

        # Remove the ad from the original dictionary
        if (adhc in dis_ads):
            del dis_ads[adhc]

        fn.saveDisabled_ads(dis_ads)

        return jsonify({"response": "OK"}), 200
    except Exception as e:
        print("ERROR:", str(e))
        return jsonify({"error": str(e)}), 400


@app.route('/delete_disabled_ad/<adhc>', methods=["DELETE", "OPTIONS"])
def delete_disabled_ad(adhc):
    dis_ads = fn.loadDisabled_ads()

    # Remove the ad from the dictionary
    if (adhc in dis_ads):
        del dis_ads[adhc]

    # Save the updated dis_ads back to storage
    fn.saveDisabled_ads(dis_ads)

    # Return a successful response indicating deletion
    return jsonify({"message": "Ad deleted successfully"}), 200


# save new message
@app.route('/sendMessage', methods=['POST'])
def sendMessage():
    try:
        data = request.get_json()

        if data is None:
            return jsonify({"error": "Invalid form data"}), 400

        required_fields = [
            'date', 'name','image_path', 'is_banned', 'last_message'
            'messages', 'topic_of_interest','unique_id'
        ]

        unique_id = data.get('unique_id')
        date = data.get('date')
        image_path = data.get('image_path')
        name = data.get('name')
        is_banned = data.get('is_banned')
        last_message = data.get('last_message')
        topic_of_interest = data.get('topic_of_interest')
        message = data.get('messages')

        messages = fn.loadMessages()

        messages[unique_id] = {
            "unique_id":unique_id,
            "date": date,
            "image_path": image_path,
            "name": name,
            "is_banned": is_banned,
            "last_message": last_message,
            "messages": message,
            "topic_of_interest": topic_of_interest
        }

        fn.saveMessages(messages)
        return jsonify({"response": "OK"}), 200
    except Exception as e:
        print("ERROR:", str(e))
        return jsonify({"error": str(e)}), 400


# get all messages
@app.route('/messages/')
def get_messages():
    messages = fn.loadMessages()
    # Assuming messages is a dictionary with message details including image_path
    messages_with_images = []
    for message_id, message_info in messages.items():
        message_info['image_url'] = request.host_url + message_info['image_path']
        messages_with_images.append(message_info)
    return jsonify(messages_with_images), 200

# get all ads
@app.route('/disabled_messages/')
def get_disabled_Messages():
    dis_messages = fn.loadDisabled_messages()
    # Assuming dis_messages is a dictionary with message details including image_path
    dis_messages_with_images = []
    for message_id, message_info in dis_messages.items():
        message_info['image_url'] = request.host_url + message_info['image_path']
        dis_messages_with_images.append(message_info)
    return jsonify(dis_messages_with_images), 200


# disable message
@app.route('/disable_message/<adhc>', methods=['POST'])
def disableMessage(adhc):
    try:
        #Fetching the message
        messages = fn.loadMessages()
        target_message = messages[adhc].copy()

        #Saving the message to new location
        dis_messages = fn.loadDisabled_messages()

        dis_messages[adhc] = target_message
        fn.saveDisabled_Messages(dis_messages)

        # Remove the message from the original dictionary
        if (adhc in messages):
            del messages[adhc]

        fn.saveMessages(messages)

        return jsonify({"response": "OK"}), 200
    except Exception as e:
        print("ERROR:", str(e))
        return jsonify({"error": str(e)}), 400


# enable message
@app.route('/enable_message/<adhc>', methods=['POST'])
def enableMessage(adhc):
    try:
        #Fetching the message
        dis_messages = fn.loadDisabled_messages()
        target_message = dis_messages[adhc].copy()

        #Saving the message to new location
        messages = fn.loadMessages()

        messages[adhc] = target_message
        fn.saveMessages(messages)

        # Remove the message from the original dictionary
        if (adhc in dis_messages):
            del dis_messages[adhc]

        fn.saveDisabled_Messages(dis_messages)

        return jsonify({"response": "OK"}), 200
    except Exception as e:
        print("ERROR:", str(e))
        return jsonify({"error": str(e)}), 400

# get an specific ad info
@app.route('/getMessage/<adhc>')
def getMessage(adhc):
    messages = fn.loadMessages()

    if not adhc in messages:
        return jsonify({"error": "add not found"}), 400

    message = messages[adhc].copy()
    message['image_url'] = request.host_url + message['image_path']
    return jsonify(message),200
