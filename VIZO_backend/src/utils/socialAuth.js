const jwt = require("jsonwebtoken");
const ApiError = require("./ApiError");

const verifyGoogleToken = async (idToken) => {
    if (!idToken) {
        throw new ApiError("Google id is required", 400);
    }

    try {
        const response = await fetch(
            `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`
        );

        if (!response.ok) {
            throw new ApiError("Invalid google ID token.", 401);
        }
        const data = await response.json();

        if (!data.sub) {
            throw new ApiError("GOOGLE User ID not found.", 401);
        }
        return {
            socialId: data.sub,
            email: data.email || null,
            name: data.name || "",
        };
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }

        throw new ApiError("Google token verification failed.", 401);
    }
}

// facebook TOken verification

const verifyFacebookToken = async (accessToken) => {
    if (!accessToken) {
        throw new ApiError("Facebook access token is required.", 400);
    }

    try {
        const response = await fetch(`https://graph.facebook.com/me?fields=id,name,email&access_token=${accessToken}`);

        if (!response.ok) {
            throw new ApiError("Invalid Facebook access token.", 401);
        }

        const data = await response.json();

        if (!data.id) {
            throw new ApiError("Facebook user ID not found.", 401);
        }
        return {
            socialId: data.id,
            email: data.email || null,
            name: data.name || "",
        };
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }

        throw new ApiError("Facebook token verification failed.", 401);
    }
};


// Apple Token verification
const verifyAppleToken = async (identityToken) => {
    if (!identityToken) {
        throw new ApiError(
            "Apple identity token is required.",
            400
        );
    }

    try {
        // First decode the JWT header to get Apple's key ID.
        const decodedHeader = jwt.decode(identityToken, {
            complete: true,
        });

        if (!decodedHeader || !decodedHeader.header) {
            throw new ApiError(
                "Invalid Apple identity token.",
                401
            );
        }

        const { kid, alg } = decodedHeader.header;

        if (!kid || alg !== "RS256") {
            throw new ApiError(
                "Invalid Apple token header.",
                401
            );
        }

        // Get Apple's public signing keys.
        const response = await fetch(
            "https://appleid.apple.com/auth/keys"
        );

        if (!response.ok) {
            throw new ApiError(
                "Unable to fetch Apple public keys.",
                500
            );
        }

        const { keys } = await response.json();

        // Find the public key used to sign this token.
        const appleKey = keys.find(
            (key) => key.kid === kid
        );

        if (!appleKey) {
            throw new ApiError(
                "Apple signing key not found.",
                401
            );
        }

        // Convert Apple's JWK key into a PEM public key.
        const crypto = require("crypto");

        const publicKey = crypto
            .createPublicKey({
                key: appleKey,
                format: "jwk",
            })
            .export({
                type: "spki",
                format: "pem",
            });
        const decoded = jwt.verify(
            identityToken,
            publicKey,
            {
                algorithms: ["RS256"],
                issuer: "https://appleid.apple.com",
                audience: process.env.APPLE_CLIENT_ID,
            }
        );

        if (!decoded.sub) {
            throw new ApiError(
                "Apple user ID not found.",
                401
            );
        }

        return {
            socialId: decoded.sub,
            email: decoded.email || null,
            name: "",
        };

    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }

        throw new ApiError(
            "Apple token verification failed.",
            401
        );
    }
};

module.exports = {
    verifyGoogleToken,
    verifyFacebookToken,
    verifyAppleToken,
};