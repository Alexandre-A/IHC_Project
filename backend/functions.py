import json

direct = 'jsons/'
files = [ 'ads.json', 'll_ads.json']

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

def saveAds(data):

    with open(direct +'ads.json', 'w') as f:
        json.dump(data, f, indent=4)

def saveAccounts(data):

    with open(direct +'accounts.json', 'w') as f:
        json.dump(data, f, indent=4)

def savell_ads(data):

    with open(direct +'ll_ads.json', 'w') as f:
        json.dump(data, f, indent=4)

def clearJsons():
    for filename in files:
        with open(direct + filename, 'w') as f:
            json.dump({}, f, indent=4)
