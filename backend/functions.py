import json

direct = 'jsons/'
files = [ 'ads.json', 'll_ads.json','disabledAds.json','messages.json','disabledMessages.json']

def loadAccounts():
    with open( direct + 'accounts.json', 'r') as f:
        info: dict = json.load(f)
    return info

def loadAds():
    with open( direct +'ads.json', 'r') as f:
        info: dict = json.load(f)
    return info

def loadll_ads():
    with open( direct +'ll_ads.json', 'r') as f:
        info: dict = json.load(f)
    return info

def loadDisabled_ads():
    with open( direct +'disabledAds.json', 'r') as f:
        info: dict = json.load(f)
    return info

def loadMessages():
    with open( direct +'messages.json', 'r') as f:
        info: dict = json.load(f)
    return info

def loadDisabled_messages():
    with open( direct +'disabledMessages.json', 'r') as f:
        info: dict = json.load(f)
    return info

def loadThreads():
    with open( direct +'forum.json', 'r') as f:
        info: dict = json.load(f)
    return info

def saveAds(data):

    with open(direct +'ads.json', 'w') as f:
        json.dump(data, f, indent=4)

def saveAccounts(data):

    with open(direct +'accounts.json', 'w') as f:
        json.dump(data, f, indent=4)

def savell_ads(data):

    with open(direct +'ll_ads.json', 'w') as f:
        json.dump(data, f, indent=4)

def saveDisabled_ads(data):

    with open(direct +'disabledAds.json', 'w') as f:
        json.dump(data, f, indent=4)

def saveMessages(data):

    with open(direct +'messages.json', 'w') as f:
        json.dump(data, f, indent=4)

def saveDisabled_Messages(data):

    with open(direct +'disabledMessages.json', 'w') as f:
        json.dump(data, f, indent=4)

def saveThread(data):

    with open(direct +'forum.json', 'w') as f:
        json.dump(data, f, indent=4)

def clearJsons():
    for filename in files:
        with open(direct + filename, 'w') as f:
            json.dump({}, f, indent=4)
