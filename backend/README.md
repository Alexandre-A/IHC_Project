## Base URL
```
http://127.0.0.1:5000
```

## Endpoints

### 1. Check if Email has Landlord Permission
**Endpoint:** `/isLandLord/<email>`

**Method:** `GET`

**Description:** Checks if the provided email has landlord permissions.

**Response:**
- `{"isLandLord": true}` if the email has landlord permissions.
- `{"isLandLord": false}` if the email does not have landlord permissions or the email is not registered.

### 2. Save New Ad
**Endpoint:** `/newAd`

**Method:** `POST`

**Description:** Saves a new advertisement.

**Request Form Data:**
- `email`: The email of the user.
- `title`: The title of the ad.
- `description`: The description of the ad.
- `date`: The date of the ad.
- `image`: The image file for the ad.

**Response:**
- `{"response": "OK"}` if the ad is successfully saved.
- `{"error": "Invalid form data"}` if the form data is invalid.
- `{"error": "email not registered"}` if the email is not registered.
- `{"error": "permission denied"}` if the user does not have landlord permissions.
- `{"error": "No image provided"}` if no image is provided.

### 3. Get All Ads
**Endpoint:** `/ads/`

**Method:** `GET`

**Description:** Retrieves all advertisements.

**Response:** A list of ads with their details including image URLs.

### 4. Get Specific Ad Info
**Endpoint:** `/ads/<adhc>`

**Method:** `GET`

**Description:** Retrieves information for a specific ad.

**Response:**
- Ad details including image URL if the ad is found.
- `{"error": "add not found"}` if the ad is not found.

### 5. Get All Ads from Landlord
**Endpoint:** `/landlord/ads/<email>`

**Method:** `GET`

**Description:** Retrieves all ads from a specific landlord.

**Response:**
- `{"response": {}}` if no ads are found for the landlord.
- `{"response": [list of ad hashes]}` if ads are found for the landlord.

### 6. Save Sign-in Info
**Endpoint:** `/signin/<email>:<psk>:<isLandlord>`

**Method:** `GET`

**Description:** Saves sign-in information for a new user.

**Response:**
- `{"response":"OK"}` if the sign-in information is successfully saved.
- `{"response":"NOK"}` if the email is already in use.

### 7. Serve Image
**Endpoint:** `/images/<filename>`

**Method:** `GET`

**Description:** Serves the stored image.

**Response:** The image file.
