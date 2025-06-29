import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI,
} from "@/lib/constants";
import { createClient } from "@supabase/supabase-js";

// Create a Supabase client for server-side operations
const supabaseAdmin = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // Use service role key for admin operations
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function POST(request: Request) {
  try {
    let code = "";
    let codeVerifier = "";

    const contentType = request.headers.get("content-type") || "";
    console.log("Content-Type:", contentType);

    // Handle different content types
    if (contentType.includes("application/json")) {
      // Handle JSON requests
      const body = await request.json();
      console.log("Parsed JSON body:", body);
      code = body.code || "";
      codeVerifier = body.code_verifier || "";
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      // Handle URL-encoded form data
      const text = await request.text();
      console.log("Raw request text:", text);
      const params = new URLSearchParams(text);
      code = params.get("code") || "";
      codeVerifier = params.get("code_verifier") || "";
    } else if (contentType.includes("multipart/form-data")) {
      // Handle multipart form data
      try {
        const formData = await request.formData();
        console.log("Parsed FormData successfully");
        
        // Use type assertion to access FormData methods
        const formDataAny = formData as any;
        
        code = formDataAny.get?.("code") || "";
        codeVerifier = formDataAny.get?.("code_verifier") || "";
        
        // Log form fields for debugging
        if (formDataAny.forEach) {
          const formEntries: string[] = [];
          formDataAny.forEach((value: any, key: any) => {
            formEntries.push(`${key}: ${typeof value === 'string' ? value : '[File/Blob]'}`);
          });
          console.log("FormData entries:", formEntries.join(", "));
        }
      } catch (formError) {
        console.log("FormData parsing failed:", formError);
      }
    } else {
      // Fallback: try to parse as text/URLSearchParams
      try {
        const text = await request.text();
        console.log("Raw request text:", text);
        const params = new URLSearchParams(text);
        code = params.get("code") || "";
        codeVerifier = params.get("code_verifier") || "";
      } catch (error) {
        console.log("Failed to parse request body:", error);
      }
    }

    console.log("Final parsed - code:", code ? "present" : "missing");
    console.log(
      "Final parsed - code_verifier:",
      codeVerifier ? "present" : "missing"
    );
    
    // Log the actual values for debugging (first few characters only)
    if (code) {
      console.log("Code preview:", code.substring(0, 10) + "...");
    }
    if (codeVerifier) {
      console.log("Code verifier preview:", codeVerifier.substring(0, 10) + "...");
    }

    if (!code) {
      return Response.json(
        { error: "Missing authorization code" },
        { status: 400 }
      );
    }

    // Debug the OAuth configuration
    console.log("GOOGLE_CLIENT_ID:", GOOGLE_CLIENT_ID ? "present" : "missing");
    console.log(
      "GOOGLE_CLIENT_SECRET:",
      GOOGLE_CLIENT_SECRET ? "present" : "missing"
    );
    console.log("GOOGLE_REDIRECT_URI:", GOOGLE_REDIRECT_URI);

    // Exchange authorization code for Google tokens
    const tokenExchangeParams = {
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: GOOGLE_REDIRECT_URI,
      grant_type: "authorization_code",
      code: code,
      // Don't include code_verifier since our custom OAuth flow doesn't use PKCE
    };

    console.log("Token exchange params:", {
      ...tokenExchangeParams,
      client_secret: "***",
      code: "***",
    });

    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(tokenExchangeParams),
    });

    const tokenData = await response.json();

    if (!response.ok || tokenData.error) {
      console.error("Google token exchange error:", tokenData);
      return Response.json(
        {
          error: tokenData.error || "Token exchange failed",
          error_description: tokenData.error_description,
        },
        { status: 400 }
      );
    }

    // Get user info from Google
    const userResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      }
    );

    if (!userResponse.ok) {
      return Response.json(
        { error: "Failed to get user info from Google" },
        { status: 400 }
      );
    }

    const googleUser = await userResponse.json();
    console.log("Google user info:", {
      email: googleUser.email,
      name: googleUser.name,
    });

    // Try to create user, if it fails because user exists, we'll generate a session anyway
    let userId: string | undefined;

    const { data: userData, error: userError } =
      await supabaseAdmin.auth.admin.createUser({
        email: googleUser.email,
        email_confirm: true, // Mark email as confirmed since it's from Google
        user_metadata: {
          full_name: googleUser.name,
          avatar_url: googleUser.picture,
          provider: "google",
          provider_id: googleUser.id,
          given_name: googleUser.given_name,
          family_name: googleUser.family_name,
        },
      });

    if (userData?.user) {
      userId = userData.user.id;
      console.log("Created new user:", userId);
    } else if (
      userError &&
      (userError.message.includes("already exists") ||
        userError.message.includes("already been registered"))
    ) {
      console.log("User already exists, proceeding with session generation...");
      // We'll generate a magic link anyway, which should work for existing users
    } else if (userError) {
      console.error("Supabase user creation error:", userError);
      return Response.json({ error: userError.message }, { status: 400 });
    }

    // Generate a Supabase session for the user (works for both new and existing users)
    console.log("Generating magic link for email:", googleUser.email);
    const { data: sessionData, error: sessionError } =
      await supabaseAdmin.auth.admin.generateLink({
        type: "magiclink",
        email: googleUser.email,
      });

    if (sessionError) {
      console.error("Supabase session generation error:", sessionError);
      return Response.json(
        { error: "Failed to create session" },
        { status: 500 }
      );
    }

    console.log(
      "Generated session data:",
      JSON.stringify(sessionData, null, 2)
    );

    // Extract the tokens from the generated link
    const url = new URL(sessionData.properties.action_link);
    console.log("Action link URL:", sessionData.properties.action_link);
    console.log("URL search params:", url.searchParams.toString());

    const accessToken = url.searchParams.get("access_token");
    const refreshToken = url.searchParams.get("refresh_token");

    console.log("Extracted access_token:", accessToken ? "present" : "missing");
    console.log(
      "Extracted refresh_token:",
      refreshToken ? "present" : "missing"
    );

    if (!accessToken || !refreshToken) {
      console.error(
        "Missing tokens in generated link. Available params:",
        Array.from(url.searchParams.keys())
      );
      return Response.json(
        { error: "Failed to generate tokens" },
        { status: 500 }
      );
    }

    // Return the Supabase tokens
    return Response.json({
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: "bearer",
      expires_in: 3600,
    });
  } catch (error) {
    console.error("Token exchange error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
